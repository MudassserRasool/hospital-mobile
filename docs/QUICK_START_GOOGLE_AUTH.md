# 🚀 Google OAuth - Quick Start Checklist

## ⚡ 5-Minute Setup for Expo Go

### Step 1️⃣: Google Cloud Console Setup (3 minutes)

1. **Go to**: [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)

2. **Create OAuth Client ID**:
   - Click "**+ CREATE CREDENTIALS**" → "**OAuth client ID**"
   - Type: **Web application** ⚠️ (MUST be Web, not iOS/Android!)
   - Name: `Hospital App - Expo Go`
   - JavaScript origins: `https://auth.expo.io`
   - Redirect URIs: `https://auth.expo.io/@anonymous/medical-clinic`
     - (Replace `@anonymous` with your Expo username if logged in)
   - Click "**CREATE**"
   - **Copy the Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

3. **Configure OAuth Consent Screen**:
   - Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
   - User type: **External**
   - App name: `Hospital Management`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `userinfo.email`, `userinfo.profile`, `openid`
   - **Test users**: Add your Gmail address
   - Save

### Step 2️⃣: Configure Your App (1 minute)

1. **Create `.env` file** in `mobile` folder:
   ```bash
   cd d:\programming\dildar-app\mobile
   copy .example.env .env
   ```

2. **Edit `.env`** with your values:
   ```env
   EXPO_PUBLIC_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
   EXPO_PUBLIC_WEB_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
   EXPO_PUBLIC_ANDROID_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
   EXPO_PUBLIC_IOS_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
   EXPO_PUBLIC_API_BASE_URL=http://192.168.43.64:3001
   ```
   - Replace `YOUR_CLIENT_ID` with the Client ID from Step 1
   - Update the API URL with your backend IP address

### Step 3️⃣: Test (1 minute)

1. **Restart Expo**:
   ```bash
   cd d:\programming\dildar-app\mobile
   npx expo start --clear
   ```

2. **Open in Expo Go** and try Google Sign In

3. **If it doesn't work**: Wait 1-2 minutes (Google needs time to update)

---

## ✅ Success Checklist

- [ ] Created **Web application** credential (not iOS/Android!)
- [ ] Added `https://auth.expo.io` to JavaScript origins
- [ ] Added `https://auth.expo.io/@username/medical-clinic` to redirect URIs
- [ ] Removed any `exp://` redirect URIs
- [ ] Configured OAuth consent screen with test user
- [ ] Created `.env` file with Client ID
- [ ] Restarted Expo with `--clear` flag
- [ ] Tested sign in

---

## 🎯 Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| Using iOS/Android credential type | Use **Web application** type |
| Redirect URI: `exp://192.168.43.64:8081` | Redirect URI: `https://auth.expo.io/@username/medical-clinic` |
| Forgot to add test user | Add your Gmail as test user |
| Different Client IDs in `.env` | Use SAME Client ID for all 4 variables |
| Didn't restart Expo | Always restart with `--clear` flag |

---

## 📚 Need More Help?

- **Quick Fix**: See `GOOGLE_OAUTH_FIX.md` for detailed troubleshooting
- **Full Guide**: See `../docs/auth/google_auth.md` for production setup
- **Environment**: See `.example.env` for all configuration options

---

## 🔧 Troubleshooting One-Liners

**Error 400: invalid_request**  
→ Use Web application credential with `https://auth.expo.io` redirect URI

**Access blocked: This app's request is invalid**  
→ Add your Gmail as test user in OAuth consent screen

**redirect_uri_mismatch**  
→ Verify redirect URI matches: `https://auth.expo.io/@username/medical-clinic`

**Invalid client**  
→ Check Client ID in `.env` matches Google Console

---

**Ready to go?** Start with Step 1 above! 🎉

