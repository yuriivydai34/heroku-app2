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

export const FileManager: React.FC = () => {
  const {
    files,
    loading,
    error,
    selectedFiles,
    toggleFileSelection,
    deleteFile
  } = useFileContext();

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
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to delete file:", error);
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
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">File Manager</h2>
        <FileUploader />
      </div>

      <Divider className="my-6" />

      <div>
        <h3 className="text-lg font-medium mb-4">Your Files</h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center p-8 bg-default-50 rounded-medium">
            <Icon icon="lucide:file" className="mx-auto mb-2 text-default-400" width={32} height={32} />
            <p className="text-default-600">No files uploaded yet</p>
            <p className="text-default-400 text-sm">Upload files using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => {
              const isSelected = selectedFiles.some(f => f.id === file.id);

              return (
                <Card key={file.id} className={`border ${isSelected ? 'border-primary' : 'border-default-200'}`}>
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
                          {formatFileSize(file.size)} • {file.mimetype.split('/')[1].toUpperCase()}
                        </div>

                        <div className="flex justify-between">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary flex items-center gap-1"
                          >
                            <Icon icon="lucide:external-link" width={14} />
                            View
                          </a>

                          <Tooltip content="Delete file" color="danger">
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
              <ModalHeader className="text-danger">Confirm Deletion</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this file? This action cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={confirmDelete}>Delete</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

// Helper function to get appropriate icon based on file type
function getFileIcon(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return "lucide:image";
  } else if (mimetype === "application/pdf") {
    return "lucide:file-text";
  } else if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) {
    return "lucide:file-spreadsheet";
  } else if (mimetype.includes("word") || mimetype.includes("document")) {
    return "lucide:file-text";
  } else if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) {
    return "lucide:file-presentation";
  } else {
    return "lucide:file";
  }
}