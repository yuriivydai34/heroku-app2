import React from "react";
import {
  Textarea,
  Button,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Checkbox
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Comment, UploadedFile } from "../../types";
import { useCommentContext } from "../../context/comment-context";
import { useFileContext } from "../../context/file-context";
import { FileUploader } from "../file-uploader";

interface CommentFormProps {
  taskId: string;
  userId: number;
  onCommentAdded?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ taskId, userId, onCommentAdded }) => {
  const { createComment } = useCommentContext();
  const { files, selectedFiles, setSelectedFiles, clearSelectedFiles, toggleFileSelection } = useFileContext();
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const {
    isOpen: isFileModalOpen,
    onOpen: onFileModalOpen,
    onOpenChange: onFileModalOpenChange
  } = useDisclosure();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    setLoading(true);

    try {
      const newComment: Comment = {
        taskId,
        userId,
        text: text.trim(),
        files: selectedFiles
      };

      await createComment(newComment);
      setText("");
      clearSelectedFiles();

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = (file: UploadedFile) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        <Textarea
          label="Add a comment"
          placeholder="Type your comment here..."
          value={text}
          onChange={handleTextChange}
          minRows={2}
          className="mb-2"
        />

        {selectedFiles.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Attached Files ({selectedFiles.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <Chip
                  key={file.id}
                  onClose={() => removeSelectedFile(file)}
                  variant="flat"
                  color="default"
                  avatar={<Icon icon={getFileIcon(file.mimetype)} />}
                  size="sm"
                >
                  {file.originalName}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            size="sm"
            variant="flat"
            startContent={<Icon icon="lucide:paperclip" />}
            onPress={onFileModalOpen}
          >
            Attach Files
          </Button>

          <Button
            color="primary"
            type="submit"
            isLoading={loading}
            isDisabled={!text.trim()}
          >
            Add Comment
          </Button>
        </div>
      </form>

      {/* File Selection Modal */}
      <Modal isOpen={isFileModalOpen} onOpenChange={onFileModalOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Attach Files</ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  <FileUploader />

                  <Divider />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Select from Existing Files</h3>
                    {files.length === 0 ? (
                      <div className="text-center p-8 bg-default-50 rounded-medium">
                        <Icon icon="lucide:file" className="mx-auto mb-2 text-default-400" width={32} height={32} />
                        <p className="text-default-600">No files available</p>
                        <p className="text-default-400 text-sm">Upload files using the form above</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((file, idx) => {
                          const isSelected = selectedFiles.some(f => f.id === file.id);

                          return (
                            <Card
                              key={idx}
                              className={`border ${isSelected ? 'border-primary bg-primary-50' : 'border-default-200'}`}
                              isPressable
                              onPress={() => toggleFileSelection(file)}
                            >
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

                                    <div className="text-xs text-default-400">
                                      {formatFileSize(file.size)} • {file.mimetype.split('/')[1].toUpperCase()}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-between w-full">
                  <div className="text-sm">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                  </div>
                  <Button variant="flat" onPress={onClose}>
                    Done
                  </Button>
                </div>
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

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
};