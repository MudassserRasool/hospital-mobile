import { AUTH_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';

interface ProfileComponentProps {
  profileData?: any;
  isLoading?: boolean;
  isUpdating?: boolean;
  onUpdateProfile?: (updateData: any) => Promise<{ success: boolean; error?: string }>;
  refetch?: () => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
  profileData,
  isLoading = false,
  isUpdating = false,
  onUpdateProfile,
  refetch,
}) => {
  const { logout } = useAuth();
  const [isEditProfile, setIsEditProfile] = useState(false);

  const handleEditPress = () => {
    setIsEditProfile(true);
  };

  const handleCancel = () => {
    setIsEditProfile(false);
  };

  const handleSave = () => {
    setIsEditProfile(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace(AUTH_ROUTES.LOGIN);
  };

  return (
    <>
      {isEditProfile ? (
        <EditProfile
          profileData={profileData}
          isLoading={isLoading}
          isUpdating={isUpdating}
          onUpdateProfile={onUpdateProfile}
          refetch={refetch}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      ) : (
        <ViewProfile
          profileData={profileData}
          isLoading={isLoading}
          onEditPress={handleEditPress}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default ProfileComponent;
