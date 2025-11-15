# Mobile App Documentation Generation Prompt

Use this prompt in Cursor AI to automatically generate comprehensive documentation for the Hospital Management System Mobile App.

---

## 📱 DOCUMENTATION GENERATION PROMPT

```
I need comprehensive, production-ready documentation for this React Native Expo mobile application for a Hospital Management System.

## PROJECT CONTEXT

### Application Overview
This is a **Hospital Appointment & Management System** mobile app with three distinct user roles:
- **Patient Role**: Browse doctors, book appointments, make payments, view medical history
- **Staff Role**: Check-in/check-out with location verification, manage leaves, view work hours
- **Owner Role**: Manage hospital staff, approve leaves, view reports, handle compensation

### Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit with RTK Query for API calls
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Google OAuth 2.0 (NO email/password login)
- **Payment Integration**: EasyPaisa (local Pakistani payment gateway)
- **Notifications**: Expo Push Notifications
- **Backend API**: NestJS REST API (to be integrated)

### Key Business Rules
1. Authentication is **ONLY via Google OAuth** - no manual registration
2. A user can ONLY have one role (patient, staff, or owner) - roles are mutually exclusive
3. Owner can also be a doctor
4. Appointment cancellations: 90% refund + 10% stored as credit/wallet balance
5. Staff attendance requires WiFi network matching AND GPS location verification
6. Payment processing through EasyPaisa only
7. All roles receive push notifications for relevant events

---

## 📋 DOCUMENTATION REQUIREMENTS

Analyze the **ENTIRE codebase** including all folders:
- `/app` - Expo Router pages and layouts
- `/components` - UI components (role-specific and shared)
- `/redux` - State management (slices, API slice with RTK Query)
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions
- `/utils` - Utility functions and helpers
- `/constants` - App constants (routes, roles, environment)
- `/theme` - Theming and styling
- `/layouts` - Layout components
- `/assets` - Images, icons, fonts

---

## 📝 CREATE THESE DOCUMENTATION FILES

### 1. **README.md**
- Project overview and purpose
- Quick start guide for developers
- Installation steps (Node.js, Expo CLI, dependencies)
- Environment setup (.env variables for API, Google OAuth, etc.)
- Running the app (iOS, Android, development build)
- Folder structure overview
- Available scripts
- Troubleshooting common issues

### 2. **ARCHITECTURE.md**
- High-level architecture diagram (describe in text/mermaid)
- Role-based app structure explanation
- Expo Router file-based routing system
- Navigation flow for each role (Patient, Staff, Owner)
- Authentication flow with Google OAuth
- How role-based access control works
- Component hierarchy and organization
- Data flow: Redux → RTK Query → Components
- Offline/online handling strategy

### 3. **FEATURES.md**
Document ALL features organized by role:

**Patient Features:**
- Google OAuth login/logout
- Browse doctors by department
- View doctor availability and time slots
- Book appointments (select doctor, date, time)
- Payment flow with EasyPaisa
- View appointment history
- View medical records (checkup history, vitals, prescriptions)
- Appointment cancellation and refund process
- Wallet/credit balance management
- Push notifications (appointment confirmations, reminders)

**Staff Features:**
- Google OAuth login/logout
- Check-in/check-out with WiFi + GPS verification
- View current shift and work hours
- Submit leave requests
- View leave balance and history
- View pending/approved/rejected leaves
- Push notifications (shift reminders, leave status)

**Owner Features:**
- Google OAuth login/logout
- View all staff members
- Add/edit/block staff members
- Set duty hours and leave policies
- Approve/deny leave requests
- Set bonuses and compensation
- View doctor appointments and patient details
- View hospital statistics and reports
- Update hospital profile
- Push notifications (leave requests, staff alerts)

### 4. **COMPONENTS.md**
- Component library structure
- UI component documentation with:
  - Component purpose
  - Props interface
  - Usage examples
  - Code snippets
- Role-specific components explanation
- Shared/reusable components
- Styling patterns and conventions
- Custom themed components

### 5. **STATE_MANAGEMENT.md**
- Redux store setup and configuration
- Explanation of Redux Toolkit slices:
  - `authSlice` - authentication state
  - `appointmentSlice` - appointment data
  - `staffSlice` - staff management
  - Any other slices found in `/redux/features`
- RTK Query setup (`apiSlice.ts`)
- API endpoint definitions
- Query vs Mutation patterns
- Cache invalidation and refetching strategies
- Error handling with RTK Query
- Loading states management
- Optimistic updates implementation

### 6. **AUTHENTICATION.md**
- Google OAuth 2.0 integration details
- Authentication flow (step-by-step with diagrams)
- Token management (storage, refresh, expiry)
- Role detection after login
- Protected routes implementation
- Auth guard/middleware
- Logout flow
- Session handling
- Security best practices

### 7. **NAVIGATION.md**
- Expo Router setup and configuration
- File-based routing structure
- Role-based navigation logic:
  - Patient routes: `/app/(patient)/*`
  - Staff routes: `/app/(staff)/*`
  - Owner routes: `/app/(owner)/*`
  - Auth routes: `/app/(auth)/*`
- Tab navigation structure
- Protected routes implementation
- Deep linking setup
- Navigation guards and redirects

### 8. **STYLING.md**
- Theming approach (light/dark mode if applicable)
- Color system and design tokens
- Typography scale
- Spacing and layout patterns
- Component styling conventions
- Responsive design strategy
- Platform-specific styles (iOS vs Android)

### 9. **API_INTEGRATION.md**
**CRITICAL for Backend Team:**
- API base URL configuration
- Expected backend endpoints (list ALL endpoints needed):
  - Authentication endpoints
  - Patient endpoints (appointments, doctors, payments)
  - Staff endpoints (attendance, leaves, work hours)
  - Owner endpoints (staff management, reports, hospital)
- Request/response formats for each endpoint
- Authentication headers (Bearer token format)
- Error response structure
- HTTP status code handling
- API versioning strategy
- Pagination patterns
- File upload handling (if any)
- WebSocket/real-time requirements (if any)

### 10. **NOTIFICATIONS.md**
- Expo Push Notifications setup
- Token registration process
- Notification types for each role
- Notification payload structure
- Handling notifications (foreground, background, killed state)
- Deep linking from notifications
- Backend integration requirements

### 11. **PAYMENTS.md**
- EasyPaisa integration details
- Payment flow for appointments
- Payment initiation
- Payment confirmation/verification
- Refund process (90% refund + 10% credit)
- Wallet credit system
- Transaction history
- Backend webhook requirements

### 12. **LOCATION_VERIFICATION.md**
- Staff check-in/check-out requirements
- WiFi SSID detection implementation
- GPS coordinates verification
- Hospital location configuration
- Privacy considerations
- Permissions handling (location, WiFi)

### 13. **TYPES_AND_INTERFACES.md**
- All TypeScript interfaces and types
- Role types (User, Patient, Staff, Owner, Doctor)
- Appointment types
- Medical record types
- Staff attendance types
- API request/response types
- Organized by domain/module

### 14. **DEVELOPMENT.md**
- Development environment setup
- Code structure and conventions
- TypeScript best practices
- Component creation guidelines
- Redux slice creation pattern
- Adding new features (step-by-step)
- Testing strategy (if tests exist)
- Debugging tips (React Native Debugger, Flipper)
- Performance optimization tips

### 15. **BUILD_AND_DEPLOY.md**
- EAS Build configuration
- Environment variables for different builds (dev, staging, production)
- Build profiles (development, preview, production)
- App signing and certificates
- Submitting to App Store (iOS)
- Submitting to Play Store (Android)
- OTA updates with EAS Update
- Version management
- Release checklist

### 16. **BACKEND_INTEGRATION_GUIDE.md**
**CRITICAL Document for Backend Team:**
- Complete API contract specification
- Required database models and relationships:
  - User model (with role field)
  - Patient model
  - Staff model
  - Owner model
  - Hospital model
  - Appointment model
  - Doctor model
  - Department model
  - Medical record model
  - Vitals model
  - Payment/Transaction model
  - Refund model
  - Wallet model
  - Attendance model
  - Leave model
- Authentication requirements:
  - Google OAuth token validation
  - JWT generation and structure
  - Role-based authorization rules
- Payment webhook requirements (EasyPaisa callbacks)
- Notification push requirements (Expo Push tokens)
- Real-time data requirements (if any)
- File upload requirements (receipts, medical documents)
- Search and filter requirements
- Pagination requirements
- Error codes and messages
- Rate limiting expectations

### 17. **TESTING.md** (if tests exist)
- Testing setup and configuration
- Unit testing with Jest
- Component testing with React Native Testing Library
- Integration testing approach
- E2E testing strategy
- Running tests
- Test coverage

### 18. **TROUBLESHOOTING.md**
- Common development issues and solutions
- Build errors and fixes
- Runtime errors and debugging
- Platform-specific issues
- Expo SDK upgrade issues
- Common Expo Router issues

---

## 🎯 DOCUMENTATION STYLE GUIDELINES

1. **Be Specific and Practical**: Include actual code examples from the codebase
2. **Use Code Blocks**: Show real implementations with proper syntax highlighting
3. **Add Mermaid Diagrams**: For flows (auth, navigation, payment, etc.)
4. **Be Backend-Friendly**: Clearly specify what the backend needs to provide
5. **Include File Paths**: Reference actual files in the codebase
6. **Developer-First**: Write for developers who will maintain this code
7. **Future-Proof**: Consider scalability and future feature additions
8. **Link Between Docs**: Cross-reference related documentation

---

## ✅ START DOCUMENTATION GENERATION

Please analyze the entire codebase systematically and generate ALL 18 documentation files in the `/docs` folder.

**Order of generation:**
1. Start with README.md for overview
2. Then ARCHITECTURE.md for structure understanding
3. Then FEATURES.md to document what the app does
4. Then technical docs (state management, auth, API integration)
5. Finally developer guides (development, build, testing)

For each file, analyze the relevant code sections and provide accurate, detailed documentation with code examples.

Begin now.
```

---

## 📌 USAGE TIPS

### If Documentation Needs Expansion:

```
Expand [FILENAME] with more details about [SPECIFIC TOPIC]. Include code examples from the codebase.
```

### To Add Diagrams:

```
Add mermaid sequence diagrams to AUTHENTICATION.md showing the Google OAuth flow step by step.
```

### To Update for New Features:

```
Update FEATURES.md and COMPONENTS.md to include the new [FEATURE_NAME] feature I just added.
```

### For Backend Team Clarifications:

```
Expand API_INTEGRATION.md with detailed request/response examples for all appointment-related endpoints.
```

---

## 🔄 KEEP DOCUMENTATION UPDATED

Run this prompt again whenever you make significant changes to:

- Project structure
- New features or roles
- API integration changes
- Authentication flow changes
- New dependencies or libraries














