import React, { useState } from 'react';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';

const ProfileComponent = () => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  return <>{isEditProfile ? <EditProfile /> : <ViewProfile />}</>;
};

export default ProfileComponent;
