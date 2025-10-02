import React, { useEffect } from 'react';
import { Notification } from '@/types';
import { notificationService } from '@/services/notification.service';

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = React.createContext<NotificationContextType>({
  notifications: [],
  loading: false,
  error: null,
  fetchNotifications: async () => { },
  markAllAsRead: async () => { },
});

export const useNotificationContext = () => React.useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await notificationService.markAsRead(
        notifications.filter(n => !n.read).map(n => Number(n.id))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to mark notifications as read');
      }
    }
  };

  const value = {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
