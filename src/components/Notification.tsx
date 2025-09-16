'use client';

import { useEffect, useState } from "react";
import notificationService from "../services/notification.service";
import { Button } from "@heroui/react";

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
    if (notifications.filter((notification) => !notification.read).length === 0) {
      return;
    }
    const unreadNotifications = notifications.filter(notification => !notification.read);
    await notificationService.markAsRead(unreadNotifications.map(n => Number(n.id)));
    // Refresh notifications after marking as read
    fetchNotifications();
  }

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <h2>Сповіщення: {notifications.length} Нові: {notifications.filter(n => !n.read).length}</h2>
      <Button onClick={() => markAllAsRead()}>Прочитати всі</Button>
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