'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import Notification from '../components/Notification';

import notificationService from "../services/notification.service";
import authService from '../services/auth.service';
import profileService from "@/services/profile.service";

type NotificationData = {
  id: string;
  content: string;
  userId: number;
  read: boolean;
  createdAt: string;
};

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any; // Allow for additional profile fields
}

const NavHeader = () => {
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const [profile, setProfile] = useState<ProfileData>();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

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

  const fetchProfile = async () => {
    const response = await profileService.fetchProfile();
    setProfile(response.data);
  };

  useEffect(() => {
    fetchNotifications();
    fetchProfile();
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 onClick={() => router.push('/dashboard')} className="text-3xl font-bold text-gray-900">CRM задачі</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button type="button"
                onClick={() => router.back()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                title="Show notifications"
              >
                🔔 Сповіщення ({notifications.filter(n => !n.read).length})
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Вийти
              </button>
              <span className="text-gray-600">{profile?.firstName} {profile?.lastName}</span>
            </div>
            {/* Notifications Popup */}
            {showNotifications && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                    title="Закрити"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Сповіщення</h2>
                  <div className="text-gray-600 text-sm">
                    <Notification />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavHeader;
