import ProfileComponent from '@/components/common/Profile/ProfileComponent';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const profile = () => {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
      <ProfileComponent />
    </ThemedView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
