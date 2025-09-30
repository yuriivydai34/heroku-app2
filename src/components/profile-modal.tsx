import { useEffect, useState } from "react";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useUserContext } from "@/context/user-context";

interface ProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onOpenChange }) => {
  const { profile, updateProfile } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile || {});

  // Update editData when profile changes or modal opens
  useEffect(() => {
    if (profile) setEditData(profile);
  }, [profile, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (updateProfile) {
      await updateProfile(editData);
    }
    setIsEditing(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader>Profile</ModalHeader>
        <ModalBody>
          {!isEditing ? (
            <>
              <p>User profile details and settings.</p>
              {profile ? (
                <Card>
                  <CardBody>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full mb-4"
                    />
                    <p><strong>Role:</strong> {profile.role}</p>
                  </CardBody>
                </Card>
              ) : (
                <p>No profile data available.</p>
              )}
            </>
          ) : (
            <>
              <Input
                label="Name"
                name="name"
                value={editData?.name || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                label="Email"
                name="email"
                value={editData?.email || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                label="Avatar URL"
                name="avatarUrl"
                value={editData?.avatarUrl || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                label="Role"
                name="role"
                value={editData?.role || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!isEditing ? (
            <>
              <Button variant="light" color="primary" onPress={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="light" onPress={() => onOpenChange(false)}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button color="primary" onPress={handleSave}>
                Save
              </Button>
              <Button variant="light" onPress={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;