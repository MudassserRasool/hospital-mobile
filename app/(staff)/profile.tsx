import ProfileComponent from '@/components/common/Profile/ProfileComponent';
import { ThemedView } from '@/components/themed-view';
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '@/redux/features/staff/staffApi';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const Profile = () => {
  const { data: profileData, isLoading, refetch } = useGetMyProfileQuery(
    undefined,
    {
      skip: false,
    }
  );
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();

  const handleUpdateProfile = async (updateData: any) => {
    try {
      await updateProfile(updateData).unwrap();
      await refetch();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Failed to update profile',
      };
    }
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
        isUpdating={isUpdating}
        onUpdateProfile={handleUpdateProfile}
        refetch={refetch}
      />
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
