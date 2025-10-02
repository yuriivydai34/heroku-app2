import { useEffect, useState } from "react";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useUserContext } from "@/context/user-context";
import { useTranslations } from 'next-intl';

interface ProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onOpenChange }) => {
  const { profile, updateProfile } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile || {});

  const t = useTranslations('ProfileModal');

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
        <ModalHeader>{t('title')}</ModalHeader>
        <ModalBody>
          {!isEditing ? (
            <>
              <p>{t('userProfileDetails')}</p>
              {profile ? (
                <Card>
                  <CardBody>
                    <p><strong>{t('nameLabel')}:</strong> {profile.name}</p>
                    <p><strong>{t('emailLabel')}:</strong> {profile.email}</p>
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full mb-4"
                    />
                    <p><strong>{t('roleLabel')}:</strong> {profile.role}</p>
                  </CardBody>
                </Card>
              ) : (
                <p>{t('noProfileData')}</p>
              )}
            </>
          ) : (
            <>
              <Input
                label={t('nameLabel')}
                name="name"
                value={editData?.name || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                label={t('emailLabel')}
                name="email"
                value={editData?.email || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                label={t('avatarUrlLabel')}
                name="avatarUrl"
                value={editData?.avatarUrl || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                label={t('roleLabel')}
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
                {t('editButton')}
              </Button>
              <Button variant="light" onPress={() => onOpenChange(false)}>
                {t('closeButton')}
              </Button>
            </>
          ) : (
            <>
              <Button color="primary" onPress={handleSave}>
                {t('saveButton')}
              </Button>
              <Button variant="light" onPress={() => setIsEditing(false)}>
                {t('cancelButton')}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;