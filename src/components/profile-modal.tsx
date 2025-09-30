import { Button } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useUserContext } from "@/context/user-context";

interface ProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onOpenChange }) => {
  const { profile } = useUserContext();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader>Profile</ModalHeader>
        <ModalBody>
          <p>User profile details and settings.</p>
          {profile ? (
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          ) : (
            <p>No profile data available.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" color="primary" onPress={() => onOpenChange(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ProfileModal;