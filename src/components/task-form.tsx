import React from "react";
import {
  Input,
  Textarea,
  Button,
  Switch,
  Select,
  SelectItem,
  Checkbox,
  CheckboxGroup,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Card,
  CardBody
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Task, UploadedFile } from "@/types";
import { useTaskContext } from "@/context/task-context";
import { useFileContext } from "@/context/file-context";
import { mockUsers } from "@/data/mock-users";
import { FileUploader } from "./file-uploader";
import { format } from "date-fns";
import { TaskChecklists } from "./checklist/task-checklists";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { createTask, updateTask } = useTaskContext();
  const { files, selectedFiles, setSelectedFiles, clearSelectedFiles, toggleFileSelection } = useFileContext();
  const isEditMode = !!task;

  const {
    isOpen: isFileModalOpen,
    onOpen: onFileModalOpen,
    onOpenChange: onFileModalOpenChange
  } = useDisclosure();

  const [formData, setFormData] = React.useState<Task>({
    title: "",
    description: "",
    active: true,
    deadline: "",
    userIdCreator: 1, // Default to first user
    usersIdAssociate: [],
    userIdSupervisor: 4, // Default to manager
    files: []
  });

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Initialize form with task data if in edit mode
  React.useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "",
      });

      // Set selected files based on task files
      if (task.files && task.files.length > 0) {
        setSelectedFiles(task.files);
      } else {
        clearSelectedFiles();
      }
    } else {
      clearSelectedFiles();
    }
  }, [task, setSelectedFiles, clearSelectedFiles]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.userIdCreator) {
      newErrors.userIdCreator = "Creator is required";
    }

    if (!formData.userIdSupervisor) {
      newErrors.userIdSupervisor = "Supervisor is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (isSelected: boolean) => {
    setFormData(prev => ({ ...prev, active: isSelected }));
  };

  const handleCreatorChange = (value: string) => {
    setFormData(prev => ({ ...prev, userIdCreator: parseInt(value) }));

    // Clear error if it exists
    if (errors.userIdCreator) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.userIdCreator;
        return newErrors;
      });
    }
  };

  const handleSupervisorChange = (value: string) => {
    setFormData(prev => ({ ...prev, userIdSupervisor: parseInt(value) }));

    // Clear error if it exists
    if (errors.userIdSupervisor) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.userIdSupervisor;
        return newErrors;
      });
    }
  };

  const handleAssociatesChange = (values: string[]) => {
    const userIds = values.map(v => parseInt(v));
    setFormData(prev => ({ ...prev, usersIdAssociate: userIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Add selected files to the task
      const taskWithFiles: Task = {
        ...formData,
        files: selectedFiles
      };

      if (isEditMode) {
        await updateTask(taskWithFiles);
      } else {
        await createTask(taskWithFiles);
      }

      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = (file: UploadedFile) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        isRequired
        isInvalid={!!errors.title}
        errorMessage={errors.title}
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleInputChange}
        minRows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline || ""}
          onChange={handleInputChange}
        />

        <div className="flex items-center h-full pt-6">
          <Switch
            isSelected={formData.active}
            onValueChange={handleSwitchChange}
          >
            Active
          </Switch>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Creator"
          selectedKeys={[formData.userIdCreator.toString()]}
          onChange={(e) => handleCreatorChange(e.target.value)}
          isRequired
          isInvalid={!!errors.userIdCreator}
          errorMessage={errors.userIdCreator}
        >
          {mockUsers.map((user) => (
            <SelectItem key={user.id.toString()} value={user.id.toString()}>
              {user.name} ({user.role})
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Supervisor"
          selectedKeys={[formData.userIdSupervisor.toString()]}
          onChange={(e) => handleSupervisorChange(e.target.value)}
          isRequired
          isInvalid={!!errors.userIdSupervisor}
          errorMessage={errors.userIdSupervisor}
        >
          {mockUsers.map((user) => (
            <SelectItem key={user.id.toString()} value={user.id.toString()}>
              {user.name} ({user.role})
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Associates</p>
        <CheckboxGroup
          value={formData.usersIdAssociate.map(id => id.toString())}
          onValueChange={handleAssociatesChange}
          className="gap-1"
        >
          {mockUsers.map((user) => (
            <Checkbox key={user.id} value={user.id.toString()}>
              {user.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>

      <Divider />

      {/* <TaskChecklists /> */}

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Attached Files</p>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={onFileModalOpen}
            startContent={<Icon icon="lucide:paperclip" />}
          >
            Manage Files
          </Button>
        </div>

        {selectedFiles.length === 0 ? (
          <p className="text-default-400 text-sm">No files attached</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file) => (
              <Chip
                key={file.id}
                onClose={() => removeSelectedFile(file)}
                variant="flat"
                color="default"
                avatar={<Icon icon={getFileIcon(file.mimetype)} />}
              >
                {file.originalName}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="flat" onPress={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
        >
          {isEditMode ? "Update Task" : "Create Task"}
        </Button>
      </div>

      {/* File Selection Modal */}
      <Modal isOpen={isFileModalOpen} onOpenChange={onFileModalOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Manage Files</ModalHeader>
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
                        {files.map((file) => {
                          const isSelected = selectedFiles.some(f => f.id === file.id);

                          return (
                            <Card
                              key={file.id}
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
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
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
    </form>
  );
};

// Add the formatFileSize function before the getFileIcon function
// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
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