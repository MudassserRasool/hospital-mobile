import React, { useState } from 'react';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';

interface ProfileComponentProps {
  // Profile data
  profileData: any;
  isLoading: boolean;
  // Mutation function
  updateProfile: (data: any) => Promise<any>;
  isUpdating: boolean;
  // Role for field configuration
  role: string;
  // Refetch function
  refetch?: () => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
  profileData,
  isLoading,
  updateProfile,
  isUpdating,
  role,
  refetch,
}) => {
  const [isEditProfile, setIsEditProfile] = useState(false);

  const handleEditPress = () => {
    setIsEditProfile(true);
  };

  const handleCancel = () => {
    setIsEditProfile(false);
  };

  const handleSave = async () => {
    setIsEditProfile(false);
    // Refetch profile data after save
    if (refetch) {
      await refetch();
    }
  };

  return (
    <>
      {isEditProfile ? (
        <EditProfile
          onCancel={handleCancel}
          onSave={handleSave}
          profileData={profileData}
          isLoading={isLoading}
          updateProfile={updateProfile}
          isUpdating={isUpdating}
          role={role}
        />
      ) : (
        <ViewProfile
          onEditPress={handleEditPress}
          profileData={profileData}
          isLoading={isLoading}
          role={role}
        />
      )}
    </>
  );
};

export default ProfileComponent;
