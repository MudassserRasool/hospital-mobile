# 🔄 Google OAuth Flow Explained

## 📊 Visual Flow Diagram

### ❌ What's Happening Now (Broken)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Your App   │────────>│    Google    │    X    │     User     │
│  (Expo Go)   │         │    OAuth     │         │    Browser   │
└──────────────┘         └──────────────┘         └──────────────┘
     │
     │ Sends: exp://192.168.43.64:8081
     │
     ▼
  ❌ ERROR 400: invalid_request
  Reason: Google doesn't accept exp:// URLs
  (No valid top-level domain like .com, .io)
```

### ✅ What Should Happen (Fixed)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Your App   │────────>│ Expo's Auth  │────────>│    Google    │────────>┌──────────────┐
│  (Expo Go)   │         │    Proxy     │         │    OAuth     │         │     User     │
└──────────────┘         └──────────────┘         └──────────────┘         │    Browser   │
     ▲                         │                         │                  └──────────────┘
     │                         │                         │                         │
     │                   Uses: https://                  │                         │
     │                   auth.expo.io/                   │                         │
     │                   @username/slug                  │                         │
     │                         │                         │                         │
     │                         ▼                         ▼                         │
     │                   ✅ Google accepts               │ User signs in          │
     │                   (Has .io domain)                └────────────────────────┘
     │                         │                         │
     │                         │◄────────────────────────┘ Returns auth code
     └─────────────────────────┘
           Returns to your app with token
```

---

## 🔧 How Expo's Auth Proxy Works

### The Problem

Google OAuth requires redirect URIs to end with a valid top-level domain (TLD):
- ✅ Accepted: `https://example.com/callback` (has `.com`)
- ✅ Accepted: `https://auth.expo.io` (has `.io`)
- ❌ Rejected: `exp://192.168.43.64:8081` (no TLD!)
- ❌ Rejected: `myapp://callback` (no TLD!)

### The Solution: Expo Auth Proxy

Expo provides a proxy service at `https://auth.expo.io` that:

1. **Receives** the OAuth callback from Google (valid HTTPS URL)
2. **Extracts** the authentication code/token
3. **Redirects** back to your app using `exp://` protocol
4. **Your app** receives the authentication result

```
┌─────────────────────────────────────────────────────────────────┐
│                     Expo Auth Proxy                             │
│                   https://auth.expo.io                          │
│                                                                 │
│  1. Google redirects here: https://auth.expo.io/@user/app       │
│  2. Proxy receives auth code from Google                        │
│  3. Proxy redirects to your app: exp://192.168.43.64:8081       │
│  4. Your app in Expo Go receives the token                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Configuration Breakdown

### Google Cloud Console Configuration

```
┌────────────────────────────────────────────────────────────────┐
│  Google Cloud Console - OAuth 2.0 Client ID                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Application type: Web application                             │
│  (⚠️ MUST be "Web application", NOT iOS/Android!)             │
│                                                                │
│  Name: Hospital App - Expo Go                                  │
│                                                                │
│  Authorized JavaScript origins:                                │
│    • https://auth.expo.io                                      │
│                                                                │
│  Authorized redirect URIs:                                     │
│    • https://auth.expo.io/@yourname/medical-clinic             │
│                                                                │
│  ❌ DO NOT ADD:                                                │
│    • exp://192.168.43.64:8081                                  │
│    • exp://localhost:8081                                      │
│    • Any URL starting with exp://                              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Your .env File Configuration

```env
# All four should be the SAME Web application Client ID for Expo Go
EXPO_PUBLIC_CLIENT_ID=123456789-abc.apps.googleusercontent.com
EXPO_PUBLIC_WEB_CLIENT_ID=123456789-abc.apps.googleusercontent.com
EXPO_PUBLIC_ANDROID_CLIENT_ID=123456789-abc.apps.googleusercontent.com
EXPO_PUBLIC_IOS_CLIENT_ID=123456789-abc.apps.googleusercontent.com

# Your backend API
EXPO_PUBLIC_API_BASE_URL=http://192.168.43.64:3001
```

---

## 🎯 Understanding Redirect URI Format

### Expo Redirect URI Format

```
https://auth.expo.io/@<username>/<slug>
         │               │          │
         │               │          └─── App slug (from app.json)
         │               └──────────────  Your Expo username
         └──────────────────────────────  Expo's auth proxy domain
```

### Finding Your Values

1. **App Slug**: Look in `app.json`
   ```json
   {
     "expo": {
       "slug": "medical-clinic"  ← This is your slug
     }
   }
   ```

2. **Expo Username**: Run in terminal
   ```bash
   cd mobile
   npx expo whoami
   ```
   - If logged in: Shows your username (e.g., `yourname`)
   - If not logged in: Use `@anonymous`

3. **Your Redirect URI**:
   - Logged in: `https://auth.expo.io/@yourname/medical-clinic`
   - Not logged in: `https://auth.expo.io/@anonymous/medical-clinic`

---

## 🔄 Complete Authentication Flow

### Step-by-Step Process

```
1. User taps "Sign in with Google"
   ↓
2. Your app calls Google.useAuthRequest()
   ↓
3. App opens browser with Google sign-in page
   ↓
4. User enters email and password
   ↓
5. User approves permissions
   ↓
6. Google redirects to: https://auth.expo.io/@yourname/medical-clinic?code=...
   ↓
7. Expo proxy receives the auth code
   ↓
8. Expo proxy redirects to: exp://192.168.43.64:8081?code=...
   ↓
9. Your app receives the authentication response
   ↓
10. App exchanges code for access token
   ↓
11. App fetches user info from Google API
   ↓
12. App sends user info to your backend
   ↓
13. Backend creates/updates user and returns JWT
   ↓
14. App saves JWT and navigates to dashboard
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Your Mobile App                           │
│                       (Expo Go)                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Login Screen (login.tsx)                                │  │
│  │                                                          │  │
│  │  • Uses expo-auth-session                               │  │
│  │  • Calls Google.useAuthRequest()                        │  │
│  │  • Opens system browser                                 │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                            │
└───────────────────┼────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  System Browser      │
         │  (WebBrowser)        │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Google OAuth        │
         │  Sign In Page        │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Expo Auth Proxy     │
         │  auth.expo.io        │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Back to Your App    │
         │  (with auth token)   │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Your Backend API    │
         │  (Login/Register)    │
         └──────────────────────┘
```

---

## 🔐 Security Notes

### Why This is Secure

1. **HTTPS**: All communication with Google happens over HTTPS
2. **Auth Code Flow**: Uses OAuth 2.0 authorization code flow (most secure)
3. **State Parameter**: Prevents CSRF attacks
4. **Short-lived Codes**: Auth codes expire quickly
5. **Token Exchange**: Access tokens never exposed to browser

### What Expo Proxy Can and Cannot Do

✅ **Can Do**:
- Forward the authentication code to your app
- Act as a bridge between Google and Expo Go
- Handle deep linking back to your app

❌ **Cannot Do**:
- Access your access token (only auth code passes through)
- Access user data
- Impersonate your app
- Modify authentication flow

### Production Considerations

For production builds (not Expo Go):
- You'll use direct redirect URIs (e.g., `myapp://oauth`)
- No Expo proxy involved
- More control over the flow
- Better for security audits

---

## 🆚 Expo Go vs Production Builds

| Aspect | Expo Go (Dev) | Production Build |
|--------|---------------|------------------|
| **Credential Type** | Web application | Android/iOS |
| **Redirect URI** | `https://auth.expo.io/...` | `myapp://callback` |
| **Proxy** | Uses Expo proxy | Direct callback |
| **Setup Time** | 5 minutes | 30+ minutes |
| **Client IDs** | 1 (same for all) | 3 (Web, Android, iOS) |
| **Certificates** | Not needed | SHA-1 (Android), Bundle ID (iOS) |

---

## 🔍 Debugging Tips

### Check Your Configuration

```bash
# 1. Verify your Expo username
cd mobile
npx expo whoami

# 2. Check your app slug
cat app.json | findstr "slug"  # Windows
cat app.json | grep "slug"     # Mac/Linux

# 3. Verify environment variables
cat .env

# 4. Test Google Console redirect URI
# It should be: https://auth.expo.io/@username/slug
```

### Common Configuration Errors

| Error | Wrong Value | Correct Value |
|-------|-------------|---------------|
| Invalid redirect | `exp://192.168.43.64:8081` | `https://auth.expo.io/@user/app` |
| Wrong client type | iOS or Android | Web application |
| Wrong username | `@yourname` when not logged in | `@anonymous` |
| Wrong slug | `medical_clinic` (underscore) | `medical-clinic` (hyphen) |

---

## 📚 Additional Resources

- [Expo AuthSession Docs](https://docs.expo.dev/guides/authentication/)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Flow Explained](https://www.oauth.com/oauth2-servers/server-side-apps/authorization-code/)

---

**Need help?** See `GOOGLE_OAUTH_FIX.md` for step-by-step troubleshooting.

