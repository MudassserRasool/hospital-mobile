import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function Button({
  children,
  onPress,
}: {
  children: any;
  onPress?: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ padding: 10, backgroundColor: '#0066ff', borderRadius: 8 }}
    >
      <ThemedText style={{ color: '#fff' }}>{children}</ThemedText>
    </TouchableOpacity>
  );
}
