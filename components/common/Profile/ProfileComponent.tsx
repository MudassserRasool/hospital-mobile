import React, { useState } from 'react';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';

const ProfileComponent = () => {
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

  return (
    <>
      {isEditProfile ? (
        <EditProfile onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <ViewProfile onEditPress={handleEditPress} />
      )}
    </>
  );
};

export default ProfileComponent;
