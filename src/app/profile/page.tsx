'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import profileService from '../../services/profile.service';
import NavHeader from '@/components/NavHeader';
import ErrorMessage from '@/components/ErrorMessage';

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({});
  const [editForm, setEditForm] = useState<ProfileData>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else {
      loadProfile();
    }
  }, [router]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await profileService.fetchProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
        setEditForm(response.data);
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('An error occurred while loading the profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await profileService.updateProfile(editForm);

      if (response.success) {
        setProfile(response.data || editForm);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating the profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NavHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-500">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccess(null)}
                    className="text-green-400 hover:text-green-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} setError={setError} />
          )}

          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Інфомація про користувача
                </h3>
                {!isEditing && (
                  <button
                    onClick={handleStartEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Редагувати профіль
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmitEdit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Ім'я
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={editForm.firstName || ''}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your first name"
                        style={{ color: 'black' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Фамілія
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={editForm.lastName || ''}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your last name"
                        style={{ color: 'black' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Елекронна пошта
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email address"
                      style={{ color: 'black' }}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {isSubmitting ? 'Saving...' : 'Зберегти зміни'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Profile Display */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ім'я</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile.firstName || 'Not provided'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Фамілія</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile.lastName || 'Not provided'}
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Електронна пошта</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.email || 'Not provided'}
                    </dd>
                  </div>
                  
                  {/* Display other profile fields if they exist */}
                  {Object.entries(profile).map(([key, value]) => {
                    if (!['firstName', 'lastName', 'email'].includes(key) && value) {
                      return (
                        <div key={key}>
                          <dt className="text-sm font-medium text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </dd>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
