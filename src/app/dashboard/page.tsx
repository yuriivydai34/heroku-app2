'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import Notification from '../../components/Notification';

import notificationService from "../../services/notification.service";

type NotificationData = {
  id: string;
  content: string;
  userId: number;
  read: boolean;
  createdAt: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/' || '';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const fetchNotifications = async () => {
    const response = await notificationService.getNotifications();
    const notificationsData: NotificationData[] = response.map((notification: any) => ({
      id: notification.id,
      content: notification.content,
      userId: notification.userId,
      read: notification.read,
      createdAt: notification.createdAt,
    }));
    setNotifications(notificationsData);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome back!</span>
              <button
                onClick={() => setShowNotifications(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                title="Show notifications"
              >
                🔔 Notifications ({notifications.filter(n => !n.read).length})
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
            {/* Notifications Popup */}
            {showNotifications && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                    title="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Notifications</h2>
                  <div className="text-gray-600 text-sm">
                    <Notification />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Dashboard Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Profile
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <button
                          onClick={() => router.push('/profile')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Manage Profile
                        </button>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tasks
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <button
                          onClick={() => router.push('/tasks')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Manage Tasks
                        </button>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Chat
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <button
                          onClick={() => router.push('/chat')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Chat with Users
                        </button>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
