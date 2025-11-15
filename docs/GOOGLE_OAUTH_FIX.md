# 🔧 Fix Google OAuth "Error 400: invalid_request" - Expo Go

## ❌ The Error You're Seeing

```
Error 400: invalid_request
Request details: redirect_uri=exp://192.168.43.64:8081
flowName=GeneralOAuthFlow
```

**Root Cause**: Google OAuth **DOES NOT** accept `exp://` redirect URIs because they don't have a valid top-level domain (like `.com`, `.io`, etc.). You must use Expo's auth proxy instead.

---

## ✅ Quick Fix (5 minutes)

Follow these exact steps to fix the issue:

### Step 1: Find Your App Information

1. Your **app slug** is: `medical-clinic` (from `app.json`)
2. Find your **Expo username**:
   ```bash
   cd d:\programming\dildar-app\mobile
   npx expo whoami
   ```
   - If you're **logged in**: You'll see your username (e.g., `yourname`)
   - If you're **NOT logged in**: You'll see "Not logged in" - use `@anonymous` instead

### Step 2: Configure Google Cloud Console

1. **Go to** [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. **Sign in** with your Google account
3. **Select your project** (or create one if you haven't)

#### Option A: If You Already Have a Credential

1. **Find** your existing OAuth 2.0 Client ID (it might be named something like "Web client" or "iOS client")
2. **Click** the pencil/edit icon next to it
3. **Check** the "Application type" at the top:

   - If it's **"Web application"**: ✅ Perfect! Continue below.
   - If it's **"iOS"** or **"Android"**: ❌ You need to create a new Web application credential (see Option B)

4. **Update "Authorized JavaScript origins"**:

   - Click "ADD URI"
   - Add: `https://auth.expo.io`
   - Click outside the field to confirm

5. **Update "Authorized redirect URIs"**:
   - **REMOVE** any URIs that start with `exp://` (these don't work!)
   - Click "ADD URI"
   - Add one of these (based on Step 1):
     - If you're logged in to Expo: `https://auth.expo.io/@yourname/medical-clinic`
     - If you're using anonymous: `https://auth.expo.io/@anonymous/medical-clinic`
     - Replace `yourname` with your actual Expo username from Step 1
6. **Click "SAVE"** at the bottom
7. **Copy the Client ID** (you'll need it in Step 3)

#### Option B: If You Need to Create a New Credential

1. **Click** "**+ CREATE CREDENTIALS**" at the top
2. **Select** "**OAuth client ID**"
3. **Choose** "**Web application**" (⚠️ IMPORTANT: Must be Web application!)
4. **Name**: `Hospital App - Expo Go`
5. **Authorized JavaScript origins**:
   - Click "ADD URI"
   - Add: `https://auth.expo.io`
6. **Authorized redirect URIs**:
   - Click "ADD URI"
   - Add: `https://auth.expo.io/@yourname/medical-clinic`
     - Replace `yourname` with your Expo username (or use `@anonymous`)
7. **Click "CREATE"**
8. **Copy the Client ID** that appears (you'll need it in Step 3)
9. **Click "OK"** to close the popup

### Step 3: Set Up OAuth Consent Screen (If Not Done)

1. **Go to** [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. If you haven't set it up:

   - **Select** "External"
   - **Click "CREATE"**
   - **Fill in required fields**:
     - App name: `Hospital Management` (or your preferred name)
     - User support email: Your email
     - Developer contact: Your email
   - **Click "SAVE AND CONTINUE"**
   - **Scopes**: Click "ADD OR REMOVE SCOPES"
     - Select: `userinfo.email`, `userinfo.profile`, `openid`
     - Click "UPDATE"
     - Click "SAVE AND CONTINUE"
   - **Test users**: Click "ADD USERS"
     - Add your Google account email
     - Click "SAVE"
     - Click "SAVE AND CONTINUE"
   - **Click "BACK TO DASHBOARD"**

3. **IMPORTANT**: Your app will be in "Testing" mode. Only test users can sign in. Make sure your Google account is added as a test user!

### Step 4: Update Your Mobile App Environment

1. **Create** a `.env` file in the `mobile` folder:

   ```bash
   cd d:\programming\dildar-app\mobile
   type nul > .env
   ```

2. **Open** `.env` and add:

   ```env
   # Replace with your actual Client ID from Step 2
   EXPO_PUBLIC_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
   EXPO_PUBLIC_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com

   # For now, use the same Client ID for all platforms (Expo Go development)
   EXPO_PUBLIC_ANDROID_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
   EXPO_PUBLIC_IOS_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com

   # Your backend API URL
   EXPO_PUBLIC_API_BASE_URL=http://192.168.43.64:3001
   ```

3. **Replace** `YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com` with the actual Client ID you copied in Step 2

   **Example**:

   ```env
   EXPO_PUBLIC_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
   EXPO_PUBLIC_WEB_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
   EXPO_PUBLIC_ANDROID_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
   EXPO_PUBLIC_IOS_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
   EXPO_PUBLIC_API_BASE_URL=http://192.168.43.64:3001
   ```

### Step 5: Restart Your App

1. **Stop** your Expo development server (press `Ctrl+C` in the terminal)
2. **Clear** Expo cache and restart:
   ```bash
   cd d:\programming\dildar-app\mobile
   npx expo start --clear
   ```
3. **Open** the app in Expo Go
4. **Try** signing in with Google again
5. **Wait** 1-2 minutes if it still doesn't work (Google needs time to propagate changes)

---

## 📋 Quick Reference

### What You Need in Google Console:

- ✅ **Application Type**: Web application (NOT iOS or Android for Expo Go!)
- ✅ **Authorized JavaScript origins**: `https://auth.expo.io`
- ✅ **Authorized redirect URIs**: `https://auth.expo.io/@yourname/medical-clinic`
- ✅ **OAuth Consent Screen**: Configured with your email as test user

### What You Need in .env File:

```env
EXPO_PUBLIC_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
EXPO_PUBLIC_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
EXPO_PUBLIC_ANDROID_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
EXPO_PUBLIC_IOS_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
EXPO_PUBLIC_API_BASE_URL=http://YOUR_BACKEND_IP:3001
```

---

## 🐛 Still Having Issues?

### Error: "Access blocked: This app's request is invalid"

**Solution**: Add your Google account as a test user:

1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Scroll to "Test users"
3. Click "ADD USERS"
4. Add your Gmail address
5. Click "SAVE"

### Error: "redirect_uri_mismatch"

**Solution**: The redirect URI in Google Console doesn't match:

1. Check your Expo username: `npx expo whoami`
2. Verify redirect URI is: `https://auth.expo.io/@yourname/medical-clinic`
3. Make sure there are no typos in the slug name

### Error: "Invalid client"

**Solution**: Wrong client ID or not using Web application type:

1. Make sure you're using a **Web application** client ID (not iOS/Android)
2. Copy the client ID again from Google Console
3. Update your `.env` file
4. Restart Expo: `npx expo start --clear`

### App Just Closes / Goes Back to Login

**Solution**: Backend might be rejecting the Google auth:

1. Check your backend is running: `http://192.168.43.64:3001/api/health`
2. Verify backend has the correct Google Client ID and Secret in its `.env`
3. Check backend logs for errors

---

## 🔒 Important Notes

1. **For Expo Go Development**: Always use a **Web application** credential with `https://auth.expo.io` redirect URI
2. **For Production Builds**: You'll need separate Android and iOS credentials (see full guide in `google_auth.md`)
3. **Test Users**: Only accounts added as test users can sign in when your app is in "Testing" mode
4. **Client ID**: Use the SAME Web application Client ID for all four environment variables during Expo Go development

---

## 📱 What's Different for Production?

When you create production builds (APK/IPA), you'll need:

1. **Android**: Create an "Android" credential with SHA-1 certificate
2. **iOS**: Create an "iOS" credential with Bundle ID
3. **Update**: Use platform-specific Client IDs in your `.env`

See `google_auth.md` for the complete production setup guide.

---

## ✅ Checklist

- [ ] Found my Expo username (or decided to use `@anonymous`)
- [ ] Created/updated Web application credential in Google Console
- [ ] Added `https://auth.expo.io` to JavaScript origins
- [ ] Added `https://auth.expo.io/@username/medical-clinic` to redirect URIs
- [ ] Removed any `exp://` redirect URIs
- [ ] Configured OAuth consent screen
- [ ] Added my Google account as a test user
- [ ] Created `.env` file with Client ID
- [ ] Restarted Expo with `npx expo start --clear`
- [ ] Waited 1-2 minutes for Google to propagate changes
- [ ] Tested Google Sign In

---

**Need More Help?**  
See the complete guide: `docs/auth/google_auth.md` or open an issue on GitHub.

**Last Updated**: November 2024  
**Status**: Quick Fix for Expo Go Development
