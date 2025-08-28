'use client';

import { useEffect, useState } from "react";
import notificationService from "../services/notification.service";

type NotificationData = {
  id: string;
  content: string;
  userId: number;
  read: boolean;
  createdAt: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/' || '';

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

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

  async function markAllAsRead(): Promise<void> {
    const unreadNotifications = notifications.filter(notification => !notification.read);
    await notificationService.markAsRead(unreadNotifications.map(n => Number(n.id)));
    // Refresh notifications after marking as read
    fetchNotifications();
  }

  return (
    <div>
      <h2>Notifications: {notifications.length} New: {notifications.filter(n => !n.read).length}</h2>
      <button onClick={() => markAllAsRead()}>Read all</button>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <p>{notification.content} {notification.read ? '✓' : '✗'}</p>
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;