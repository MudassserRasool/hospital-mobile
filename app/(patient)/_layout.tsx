/**
 * Patient Module Layout
 * Stack navigation for patient screens
 */

import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="browse-doctors" />
      <Stack.Screen name="book-appointment" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="appointment-history" />
      <Stack.Screen name="appointment-details" />
      <Stack.Screen name="wallet" />
    </Stack>
  );
}
