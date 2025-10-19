import { ThemedView } from '@/components/themed-view';
import React from 'react';

export default function ScreenLayout({ children }: { children: any }) {
  return <ThemedView style={{ flex: 1 }}>{children}</ThemedView>;
}
