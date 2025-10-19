import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';

/**
 * Hospital profile
 * Created: 2025-10-19T08:48:30.736Z
 */

export default function HospitalProfile() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ThemedText>HospitalProfile</ThemedText>
    </ThemedView>
  );
}
