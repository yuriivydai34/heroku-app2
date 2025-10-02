import { useNotificationContext } from "@/context/notification-context";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

interface NotificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationModal = ({ isOpen, onOpenChange }: NotificationModalProps) => {
  const { notifications, markAllAsRead } = useNotificationContext();
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader>Notifications</ModalHeader>
        <ModalBody>
          <h2>Notifications: {notifications.length} New: {notifications.filter(n => !n.read).length}</h2>
          <Button onPress={() => markAllAsRead()}>Mark all as read</Button>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
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