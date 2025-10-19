// scripts/bootstrap-structure.js
// Run with: node scripts/bootstrap-structure.js
// Safe / idempotent: will NOT overwrite existing files.

const fs = require('fs');
const path = require('path');

const root = process.cwd();

function safeMkdir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    created.push(dirPath);
  } else {
    skipped.push(dirPath);
  }
}

function createFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    existingFiles.push(filePath);
    return false;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  createdFiles.push(filePath);
  return true;
}

function tsxScreenTemplate(name, comment) {
  return `import React from "react";
import { View, Text } from "react-native";

/**
 * ${comment || name}
 * Created: ${new Date().toISOString()}
 */

export default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>${name}</Text>
    </View>
  );
}
`;
}

function layoutTemplate(comment) {
  return `import React from "react";
import { Slot } from "expo-router";

/**
 * ${comment || 'Layout file for grouped routes'}
 * Created: ${new Date().toISOString()}
 */

export default function Layout() {
  return <Slot />;
}
`;
}

const skipFiles = [
  // Those default files you asked not to overwrite (common expo template files)
  path.join(root, 'app', '_layout.tsx'),
  path.join(root, 'app', 'modal.tsx'),
  path.join(root, 'app', '(tabs)', '_layout.tsx'),
  path.join(root, 'app', '(tabs)', 'index.tsx'),
  path.join(root, 'app', '(tabs)', 'explore.tsx'),
];

const dirs = [
  path.join(root, 'app'),
  path.join(root, 'app', '(auth)'),
  path.join(root, 'app', '(patient)'),
  path.join(root, 'app', '(staff)'),
  path.join(root, 'app', '(owner)'),
  path.join(root, 'components'),
  path.join(root, 'components', 'ui'),
  path.join(root, 'components', 'role-specific'),
  path.join(root, 'hooks'),
  path.join(root, 'layouts'),
  path.join(root, 'store'),
  path.join(root, 'store', 'slices'),
  path.join(root, 'store', 'services'),
  path.join(root, 'theme'),
  path.join(root, 'types'),
  path.join(root, 'utils'),
  path.join(root, 'assets'),
  path.join(root, 'assets', 'images'),
  path.join(root, 'assets', 'fonts'),
  path.join(root, 'scripts'),
];

const filesToEnsure = [
  // app root
  {
    p: path.join(root, 'app', 'index.tsx'),
    t: tsxScreenTemplate('HomeScreen', 'Root / index screen (safe to create)'),
  },
  // (auth)
  {
    p: path.join(root, 'app', '(auth)', '_layout.tsx'),
    t: layoutTemplate('Auth group layout'),
  },
  {
    p: path.join(root, 'app', '(auth)', 'login.tsx'),
    t: tsxScreenTemplate('LoginScreen', 'Login'),
  },
  {
    p: path.join(root, 'app', '(auth)', 'register.tsx'),
    t: tsxScreenTemplate('RegisterScreen', 'Register'),
  },
  // (patient)
  {
    p: path.join(root, 'app', '(patient)', '_layout.tsx'),
    t: layoutTemplate('Patient group layout (tabs or stack)'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'dashboard.tsx'),
    t: tsxScreenTemplate('PatientDashboard', 'Patient Dashboard'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'browse-doctors.tsx'),
    t: tsxScreenTemplate('BrowseDoctors', 'Browse doctors'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'book-appointment.tsx'),
    t: tsxScreenTemplate('BookAppointment', 'Book an appointment'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'appointment-history.tsx'),
    t: tsxScreenTemplate('AppointmentHistory', 'Appointment history'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'appointment-details.tsx'),
    t: tsxScreenTemplate('AppointmentDetails', 'Appointment details'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'payment.tsx'),
    t: tsxScreenTemplate('PaymentScreen', 'Payment screen'),
  },
  {
    p: path.join(root, 'app', '(patient)', 'wallet.tsx'),
    t: tsxScreenTemplate('WalletScreen', 'Wallet'),
  },
  // (staff)
  {
    p: path.join(root, 'app', '(staff)', '_layout.tsx'),
    t: layoutTemplate('Staff group layout'),
  },
  {
    p: path.join(root, 'app', '(staff)', 'dashboard.tsx'),
    t: tsxScreenTemplate('StaffDashboard', 'Staff dashboard'),
  },
  {
    p: path.join(root, 'app', '(staff)', 'check-in-out.tsx'),
    t: tsxScreenTemplate('CheckInOut', 'Check-in / out'),
  },
  {
    p: path.join(root, 'app', '(staff)', 'leave-management.tsx'),
    t: tsxScreenTemplate('LeaveManagement', 'Leave management'),
  },
  {
    p: path.join(root, 'app', '(staff)', 'request-leave.tsx'),
    t: tsxScreenTemplate('RequestLeave', 'Request leave'),
  },
  {
    p: path.join(root, 'app', '(staff)', 'work-hours.tsx'),
    t: tsxScreenTemplate('WorkHours', 'Work hours'),
  },
  {
    p: path.join(root, 'app', '(staff)', 'attendance-history.tsx'),
    t: tsxScreenTemplate('AttendanceHistory', 'Attendance history'),
  },
  // (owner)
  {
    p: path.join(root, 'app', '(owner)', '_layout.tsx'),
    t: layoutTemplate('Owner group layout'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'dashboard.tsx'),
    t: tsxScreenTemplate('OwnerDashboard', 'Owner dashboard'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'staff-list.tsx'),
    t: tsxScreenTemplate('StaffList', 'Staff list'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'staff-details.tsx'),
    t: tsxScreenTemplate('StaffDetails', 'Staff details'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'add-staff.tsx'),
    t: tsxScreenTemplate('AddStaff', 'Add staff'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'leave-approvals.tsx'),
    t: tsxScreenTemplate('LeaveApprovals', 'Leave approvals'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'doctor-appointments.tsx'),
    t: tsxScreenTemplate('DoctorAppointments', 'Doctor appointments'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'hospital-profile.tsx'),
    t: tsxScreenTemplate('HospitalProfile', 'Hospital profile'),
  },
  {
    p: path.join(root, 'app', '(owner)', 'bonuses.tsx'),
    t: tsxScreenTemplate('Bonuses', 'Bonuses overview'),
  },

  // layouts
  {
    p: path.join(root, 'layouts', 'ScreenLayout.tsx'),
    t: `import React from "react";\nimport { View } from "react-native";\n\nexport default function ScreenLayout({ children }:{ children:any }) {\n  return <View style={{flex:1}}>{children}</View>;\n}\n`,
  },
  {
    p: path.join(root, 'layouts', 'TabLayout.tsx'),
    t: `import React from "react";\nimport { Slot } from "expo-router";\n\nexport default function TabLayout() {\n  return <Slot />;\n}\n`,
  },

  // shared components (small safe starter)
  {
    p: path.join(root, 'components', 'ui', 'Button.tsx'),
    t: `import React from "react";\nimport { TouchableOpacity, Text } from "react-native";\n\nexport default function Button({ children, onPress }:{ children:any; onPress?:any }){\n  return (\n    <TouchableOpacity onPress={onPress} style={{padding:10, backgroundColor:'#0066ff', borderRadius:8}}>\n      <Text style={{color:'#fff'}}>{children}</Text>\n    </TouchableOpacity>\n  )\n}\n`,
  },

  {
    p: path.join(root, 'hooks', 'useAuth.ts'),
    t: `import { useState } from "react";\n\nexport default function useAuth(){\n  const [user, setUser] = useState(null);\n  return { user, setUser };\n}\n`,
  },

  {
    p: path.join(root, 'theme', 'colors.ts'),
    t: `export const colors = { primary: '#0066ff', background: '#fff' };\n`,
  },

  {
    p: path.join(root, 'types', 'common.types.ts'),
    t: `export type ID = string | number;\n`,
  },

  {
    p: path.join(root, 'utils', 'dateFormatter.ts'),
    t: `export function formatDateISO(date:Date){ return date.toISOString(); }\n`,
  },

  // store placeholder
  {
    p: path.join(root, 'store', 'index.ts'),
    t: `// Add Redux Toolkit store setup here\n`,
  },
];

const created = [];
const createdFiles = [];
const skipped = [];
const existingFiles = [];

console.log('Bootstrapping project structure...');

// 1) create directories
dirs.forEach((d) => safeMkdir(d));

// 2) Ensure files exist, but skip if in skipFiles list or file exists.
filesToEnsure.forEach((entry) => {
  const fp = entry.p;
  // if it's one of the sensitive default template files, skip creation
  if (skipFiles.some((s) => path.normalize(s) === path.normalize(fp))) {
    skipped.push(fp + ' (protected default file)');
    return;
  }
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  createFileIfMissing(fp, entry.t);
});

// Summary
console.log('\n--- Bootstrap summary ---');
console.log('Created directories:', created.length);
created.slice(0, 50).forEach((d) => console.log('  +', path.relative(root, d)));

console.log('\nCreated files:', createdFiles.length);
createdFiles
  .slice(0, 50)
  .forEach((f) => console.log('  +', path.relative(root, f)));

console.log('\nSkipped (already existed):', existingFiles.length);
existingFiles
  .slice(0, 50)
  .forEach((f) => console.log('  -', path.relative(root, f)));

console.log('\nProtected / intentionally skipped files:', skipped.length);
skipped.slice(0, 50).forEach((s) => console.log('  *', s));

console.log('\nDone. Check the created files and adapt content as needed.');
