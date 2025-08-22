'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import Profile from '../../components/Profile';

export default function UserProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Manage your profile</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Profile Information
              </h3>
              <Profile />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
