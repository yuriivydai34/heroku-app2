import React from "react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFileContext } from "../context/file-context";
import { FileUploader } from "./file-uploader";
import { useTranslations } from "next-intl";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const FileManager: React.FC = () => {
  const {
    files,
    loading,
    error,
    selectedFiles,
    toggleFileSelection,
    deleteFile
  } = useFileContext();

  const t = useTranslations('FileManager');

  const [fileToDelete, setFileToDelete] = React.useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteClick = (fileId: number) => {
    setFileToDelete(fileId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (fileToDelete !== null) {
      try {
        await deleteFile(fileToDelete);
        onOpenChange();
      } catch (error) {
        console.error(t('deleteFailed'), error);
      }
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  if (error) {
    return (
      <div className="p-4 bg-danger-50 text-danger rounded-medium">
        {t('error')}: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
        <FileUploader />
      </div>

      <Divider className="my-6" />

      <div>
        <h3 className="text-lg font-medium mb-4">{t('yourFiles')}</h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center p-8 bg-default-50 rounded-medium">
            <Icon icon="lucide:file" className="mx-auto mb-2 text-default-400" width={32} height={32} />
            <p className="text-default-600">{t('noFilesUploaded')}</p>
            <p className="text-default-400 text-sm">{t('uploadFilesUsingForm')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, idx) => {
              const isSelected = selectedFiles.some(f => f.id === file.id);

              return (
                <Card key={idx} className={`border ${isSelected ? 'border-primary' : 'border-default-200'}`}>
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        isSelected={isSelected}
                        onValueChange={() => toggleFileSelection(file)}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            icon={getFileIcon(file.mimetype)}
                            className="text-default-600"
                            width={20}
                            height={20}
                          />
                          <span className="font-medium truncate" title={file.originalName}>
                            {file.originalName}
                          </span>
                        </div>

                        <div className="text-xs text-default-400 mb-3">
                          {formatFileSize(file.size)} • {typeof file.mimetype === "string" && file.mimetype.includes('/')
                            ? file.mimetype.split('/')[1].toUpperCase()
                            : "UNKNOWN"}
                        </div>

                        <div className="flex justify-between">
                          <a
                            href={`${baseUrl}/${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary flex items-center gap-1"
                          >
                            <Icon icon="lucide:external-link" width={14} />
                            {t('view')}
                          </a>

                          <Tooltip content={t('deleteFile')} color="danger">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => handleDeleteClick(file.id!)}
                            >
                              <Icon icon="lucide:trash" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-danger">{t('deleteConfirmation')}</ModalHeader>
              <ModalBody>
                {t('deleteFileWarning')}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>{t('cancel')}</Button>
                <Button color="danger" onPress={confirmDelete}>{t('delete')}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

// Helper function to get appropriate icon based on file type
function getFileIcon(mimetype: string | undefined): string {
  if (typeof mimetype === "string" && mimetype.startsWith("image/")) {
    return "lucide:image";
  } else if (mimetype === "application/pdf") {
    return "lucide:file-text";
  } else if (typeof mimetype === "string" && (mimetype.includes("spreadsheet") || mimetype.includes("excel"))) {
    return "lucide:file-spreadsheet";
  } else if (typeof mimetype === "string" && (mimetype.includes("word") || mimetype.includes("document"))) {
    return "lucide:file-text";
  } else if (typeof mimetype === "string" && (mimetype.includes("presentation") || mimetype.includes("powerpoint"))) {
    return "lucide:file-presentation";
  } else {
    return "lucide:file";
  }
}