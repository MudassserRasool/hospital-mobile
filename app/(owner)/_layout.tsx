/**
 * Owner Module Layout
 * Stack navigation for owner screens
 */

import { Stack } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="staff-list" />
      <Stack.Screen name="staff-details" />
      <Stack.Screen name="add-staff" />
      <Stack.Screen name="leave-approvals" />
      <Stack.Screen name="doctor-appointments" />
      <Stack.Screen name="hospital-profile" />
      <Stack.Screen name="bonuses" />
    </Stack>
  );
}
