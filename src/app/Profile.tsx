'use client';

import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/profile');
        const data = await response.json();
        setProfile(data);
        console.log('Fetched profile:', data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <div>
        profile: {profile ? JSON.stringify(profile) : 'Loading...'}
      </div>
    </div>
  );
};

export default Profile;