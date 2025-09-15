'use client';

import React, { useEffect, useState } from 'react';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import { Button } from '@heroui/react';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);

      const result = await profileService.fetchProfile();

      if (result.success) {
        setProfile(result.data || null);
        console.log('Fetched profile:', result.data);
      } else {
        setError(result.message || 'Failed to load profile');
      }

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authService.isAuthenticated()) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <div className="text-sm text-blue-600">
            Use the login form above to access your profile.
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Спробувати ще раз
          </Button>
        </div>
      </div>
    );
  }

  // Show profile data
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
      </div>

      {profile ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          No profile data available
        </div>
      )}
    </div>
  );
};

export default Profile;