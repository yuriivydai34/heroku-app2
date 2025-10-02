import { useNotificationContext } from "@/context/notification-context";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useTranslations } from 'next-intl';

interface NotificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationModal = ({ isOpen, onOpenChange }: NotificationModalProps) => {
  const { notifications, markAllAsRead } = useNotificationContext();
  const t = useTranslations('NotificationModal');
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>{t('notificationsTitle')}</ModalHeader>
        <ModalBody>
          <h2>{t('notificationsCount', { count: notifications.length })} {t('notificationsNewCount', { count: notifications.filter(n => !n.read).length })}</h2>
          <Button onPress={() => markAllAsRead()}>{t('markAllAsRead')}</Button>
          {notifications.length === 0 ? (
            <p>{t('noNewNotifications')}</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>{notification.content} <span>{notification.read ? '✓' : '✗'}</span></li>
              ))}
            </ul>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NotificationModal;