# 🚀 Quick Start Guide - Hospital Management App

## Prerequisites Checklist

- ✅ Node.js installed (v18 or higher)
- ✅ npm or yarn installed
- ✅ Expo CLI installed (`npm install -g expo-cli`)
- ✅ Expo Go app on your mobile device (from App Store/Play Store)

---

## 📦 Installation Steps

### 1. Install Dependencies

```bash
cd hospital-mobile
npm install
```

### 2. Start the Development Server

```bash
npm start
```

This will open the Expo DevTools in your browser and show a QR code.

### 3. Run on Your Device

**Option A: Physical Device**

1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code from your terminal
3. App will load on your device

**Option B: Emulator/Simulator**

- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)

---

## 🔑 Using the App

### Testing Different Roles

The app currently uses mock authentication. To test different roles:

#### **As Patient** (Default)

1. Open the app → Login screen
2. Enter any email/password
3. Tap "Sign In" or "Sign in with Google"
4. You'll be directed to the Patient Dashboard

#### **As Staff**

In `app/(auth)/login.tsx`, line 43, change:

```typescript
role: 'staff' as const,  // Change from 'patient' to 'staff'
```

#### **As Owner**

In `app/(auth)/login.tsx`, line 43, change:

```typescript
role: 'owner' as const,  // Change from 'patient' to 'owner'
```

---

## 🎨 What You'll See

### Patient Experience

1. **Beautiful Dashboard** - Medical specialty grid, top doctors, featured banner
2. **Browse Doctors** - Search and filter doctors by specialty
3. **Book Appointment** - Select date, time, and proceed to payment
4. **Wallet** - View balance and transaction history
5. **Appointment History** - Track all your appointments

### Staff Experience

1. **Dashboard** - Check-in status and quick actions
2. **Check-In/Out** - Location-verified attendance system
3. **Attendance History** - View all attendance records
4. **Leave Management** - Check balance and request leaves
5. **Work Hours** - Detailed hours breakdown

### Owner Experience

1. **Dashboard** - Hospital statistics and pending tasks
2. **Staff Management** - View, add, and manage staff
3. **Leave Approvals** - Approve/reject leave requests
4. **Doctor Appointments** - View doctor-wise appointments
5. **Hospital Profile** - Edit hospital information
6. **Bonuses** - Grant bonuses to staff

---

## 🎯 Key Features to Explore

### ✨ UI/UX Features

- Pull down to refresh on any list
- Search bars with filters
- Smooth animations and transitions
- Beautiful status badges
- Empty states with helpful messages

### 🎨 Design Highlights

- **Modern Color Scheme** - Medical-friendly blue and purple
- **Card-Based Layout** - Clean, organized information
- **Icon-Driven Interface** - Material Icons throughout
- **Responsive Design** - Works on all screen sizes

---

## 🧪 Testing Scenarios

### Patient Flow

1. Login → Patient Dashboard
2. Tap "Doctor Speciality" → "See All" → Browse Doctors
3. Select a doctor → Book Appointment
4. Choose date & time → Continue to Payment
5. Select payment method → Confirm & Pay
6. View in Appointment History

### Staff Flow

1. Login (as staff) → Staff Dashboard
2. Tap "Check In" → Verify location → Check in
3. View "Attendance History"
4. Request a leave → "Leave Management" → + button
5. Fill form → Submit

### Owner Flow

1. Login (as owner) → Owner Dashboard
2. View statistics cards
3. Tap "Staff Management" → View all staff
4. Tap + button → Add new staff
5. Go to "Leave Approvals" → Approve/Reject requests
6. Grant bonus in "Bonuses" screen

---

## 🐛 Common Issues & Solutions

### Issue: "Metro Bundler not starting"

**Solution:**

```bash
npx expo start --clear
```

### Issue: "Module not found"

**Solution:**

```bash
rm -rf node_modules
npm install
```

### Issue: "Can't scan QR code"

**Solution:**

- Ensure phone and computer are on same WiFi network
- Try "Tunnel" mode in Expo DevTools
- Or use "expo://..." URL manually in Expo Go app

### Issue: "App crashes on launch"

**Solution:**

- Check if all dependencies are installed
- Restart the Metro bundler
- Clear cache: `npx expo start --clear`

---

## 📱 Navigation Tips

### Bottom Navigation (Patient)

- **Home** - Dashboard
- **Appointments** - Appointment history
- **History** - Medical history
- **Articles** - Health articles (placeholder)
- **Profile** - User profile

### Quick Access

- **FAB Button** - Floating Action Button for primary actions (Add Staff, Request Leave)
- **Back Button** - Top-left corner on detail screens
- **Pull to Refresh** - Works on all list screens

---

## 🎨 Customization

### Changing Theme Colors

Edit `constants/theme.ts`:

```typescript
export const BrandColors = {
  primary: '#4B7BEC', // Change this to your brand color
  secondary: '#5F27CD',
  // ...
};
```

### Modifying Mock Data

Edit `utils/mockData.ts` to add/modify:

- Doctors
- Appointments
- Staff members
- Specialties
- etc.

---

## 📊 Project Structure Overview

```
hospital-mobile/
├── app/                    # All screens
│   ├── (auth)/            # Login, Register
│   ├── (patient)/         # Patient screens
│   ├── (staff)/           # Staff screens
│   └── (owner)/           # Owner screens
├── components/
│   └── ui/                # Reusable components
├── redux/                 # State management
├── constants/             # Theme, routes, etc.
├── types/                 # TypeScript types
└── utils/                 # Mock data & utilities
```

---

## 🔄 Next Steps

### For Development

1. ✅ App is running with mock data
2. Start building your backend API
3. Replace mock data with real API calls in Redux RTK Query
4. Implement Google OAuth
5. Integrate payment gateway

### For Production

1. Update `app.json` with real app details
2. Configure splash screen and app icon
3. Set up environment variables
4. Build for production: `eas build`
5. Submit to App Store / Play Store

---

## 📚 Additional Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **Redux Toolkit**: https://redux-toolkit.js.org
- **Material Icons**: https://materialdesignicons.com

---

## 💡 Pro Tips

1. **Hot Reload** - Shake device to reload or press `r` in terminal
2. **Debug Menu** - Shake device to access debug menu
3. **Component Inspector** - Enable in debug menu to inspect layout
4. **Performance Monitor** - Available in debug menu
5. **Fast Refresh** - Auto-reloads on file save

---

## 🎉 You're All Set!

Your Hospital Management App is ready to use! Start exploring the different user roles and features.

### Quick Test Checklist

- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] Can navigate between screens
- [ ] Search functionality works
- [ ] Forms can be submitted
- [ ] Lists can be refreshed
- [ ] All three roles are accessible

---

**Need Help?** Check PROJECT_SUMMARY.md for detailed feature documentation.

**Happy Coding! 🚀**
