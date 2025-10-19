import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';

/**
 * Patient Dashboard
 * Created: 2025-10-19T08:48:30.735Z
 */

export default function PatientDashboard() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ThemedText>PatientDashboard</ThemedText>
    </ThemedView>
  );
}
