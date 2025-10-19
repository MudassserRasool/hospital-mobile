/**
 * Staff Module Layout
 * Stack navigation for staff screens
 */

import { Stack } from 'expo-router';

export default function StaffLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="check-in-out" />
      <Stack.Screen name="attendance-history" />
      <Stack.Screen name="leave-management" />
      <Stack.Screen name="request-leave" />
      <Stack.Screen name="work-hours" />
    </Stack>
  );
}
