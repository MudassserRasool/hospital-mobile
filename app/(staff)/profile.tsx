import ProfileComponent from '@/components/common/Profile/ProfileComponent';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '@/redux/features/staff/staffApi';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const profile = () => {
  const { user } = useAuth();
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useGetMyProfileQuery(undefined, {
    skip: !user,
  });

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();

  const handleUpdateProfile = async (data: any) => {
    return await updateProfile(data).unwrap();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
      <ProfileComponent
        profileData={profileData}
        isLoading={isLoading}
        updateProfile={handleUpdateProfile}
        isUpdating={isUpdating}
        role={user?.role || 'staff'}
        refetch={refetch}
      />
    </ThemedView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
