# 📚 Mobile App Documentation

Welcome to the mobile app documentation! This directory contains guides and documentation for the Hospital Management mobile application.

---

## 🚀 Quick Links

### Getting Started

- **[Quick Start Google Auth](QUICK_START_GOOGLE_AUTH.md)** - 5-minute setup checklist
- **[Google OAuth Fix](GOOGLE_OAUTH_FIX.md)** - Fix "Error 400: invalid_request"
- **[Environment Setup](../.example.env)** - Configure environment variables

### Detailed Guides

- **[Complete Google Auth Guide](../docs/auth/google_auth.md)** - Full setup for development and production

---

## 🐛 Having Issues?

### Common Errors

| Error | Solution |
|-------|----------|
| `Error 400: invalid_request` | See [GOOGLE_OAUTH_FIX.md](GOOGLE_OAUTH_FIX.md) |
| `redirect_uri_mismatch` | Check redirect URI in Google Console |
| `Access blocked` | Add your email as test user |
| `Invalid client` | Verify Client ID in `.env` file |

### Quick Fixes

1. **OAuth Error** → [GOOGLE_OAUTH_FIX.md](GOOGLE_OAUTH_FIX.md)
2. **Can't find file** → Check [../docs/auth/](../docs/auth/) folder
3. **Environment variables** → Copy [../.example.env](../.example.env) to `.env`

---

## 📁 Documentation Structure

```
mobile/
├── docs/
│   ├── README.md                    ← You are here
│   ├── QUICK_START_GOOGLE_AUTH.md  ← 5-min setup
│   └── GOOGLE_OAUTH_FIX.md         ← Troubleshooting guide
├── .example.env                     ← Environment template
├── .env                            ← Your config (not in Git)
└── app.json                        ← App configuration
```

---

## 🔐 Authentication Setup

### For Development (Expo Go)

1. Follow **[QUICK_START_GOOGLE_AUTH.md](QUICK_START_GOOGLE_AUTH.md)**
2. Create `.env` file from `.example.env`
3. Configure Google Cloud Console
4. Test in Expo Go

### For Production (Standalone Builds)

1. Follow **[Complete Google Auth Guide](../docs/auth/google_auth.md)**
2. Create platform-specific credentials
3. Configure keystores/certificates
4. Build and test

---

## 🛠️ Development Workflow

### First Time Setup

```bash
# 1. Install dependencies
cd mobile
npm install

# 2. Configure environment
copy .example.env .env
# Edit .env with your values

# 3. Start development server
npx expo start
```

### Daily Development

```bash
# Start Expo
npx expo start

# Clear cache if needed
npx expo start --clear
```

---

## 📱 App Information

- **App Name**: Hospital Management
- **Slug**: `medical-clinic`
- **Scheme**: `medicalclinic`
- **Package Name** (Android): `com.mudasser2023.medicalclinic`
- **Bundle ID** (iOS): `com.mudasser2023.medicalclinic`

---

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo AuthSession](https://docs.expo.dev/guides/authentication/)

---

## 🆘 Need Help?

1. **Check existing guides** in this folder
2. **Search for error message** in [GOOGLE_OAUTH_FIX.md](GOOGLE_OAUTH_FIX.md)
3. **Review environment variables** in [.example.env](../.example.env)
4. **Check app configuration** in [app.json](../app.json)

---

**Last Updated**: November 2024  
**Maintained by**: Development Team

