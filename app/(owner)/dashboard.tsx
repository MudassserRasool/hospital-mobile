import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';

/**
 * Owner dashboard
 * Created: 2025-10-19T08:48:30.736Z
 */

export default function OwnerDashboard() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ThemedText>OwnerDashboard</ThemedText>
    </ThemedView>
  );
}
