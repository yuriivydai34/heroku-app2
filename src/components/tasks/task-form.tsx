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
import { Task, TaskRequest, UploadedFile } from "@/types";
import { useTaskContext } from "@/context/task-context";
import { useFileContext } from "@/context/file-context";
import { FileUploader } from "../file-uploader";
import { format } from "date-fns";
import { TaskChecklists } from "../checklist/task-checklists";
import { useUserContext } from "@/context/user-context";
import { useTaskTemplateContext } from "@/context/task-template-context";
import { TaskTemplateData } from "@/types";
import { useTranslations } from 'next-intl';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { users } = useUserContext();
  const { createTask, updateTask } = useTaskContext();
  const { files, selectedFiles, setSelectedFiles, clearSelectedFiles, toggleFileSelection } = useFileContext();
  const [templateSelected, setTemplateSelected] = React.useState<TaskTemplateData | null>(null);
  const { templates } = useTaskTemplateContext();

  const t = useTranslations('TaskForm');

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
    usersIdAssociate: [],
    userIdSupervisor: 0, // <-- use 0 as default number
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
      newErrors.title = t('titleRequired');
    }

    if (!formData.deadline) {
      newErrors.deadline = t('deadlineRequired');
    }

    if (!formData.userIdSupervisor) {
      newErrors.userIdSupervisor = t('supervisorRequired');
    }

    if (!formData.usersIdAssociate || formData.usersIdAssociate.length === 0) {
      newErrors.usersIdAssociate = t('associatesRequired');
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

    // Clear error if it exists
    if (errors.usersIdAssociates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.usersIdAssociates;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Add selected files to the task
      const taskWithFiles: TaskRequest = {
        ...formData,
        userIdSupervisor: Number(formData.userIdSupervisor),
        files: selectedFiles.map(f => f.id)
      };

      if (isEditMode) {
        await updateTask(taskWithFiles);
      } else {
        await createTask(taskWithFiles);
      }

      onClose();
    } catch (error) {
      console.error(t('errorSavingTask'), error);
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = (file: UploadedFile) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
  };

  const onSelectTemplate = (template: TaskTemplateData) => {
    setTemplateSelected(template);
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        id="template"
        label="Template"
        value={templateSelected?.id?.toString() || "0"}
        onChange={(e) => {
          if (e.target.value === "0") {
            setTemplateSelected(null);
          } else {
            const selectedTemplate = templates.find(
              (template) => String(template.id) === e.target.value
            );
            if (selectedTemplate) {
              onSelectTemplate(selectedTemplate);
            }
          }
        }}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        style={{ color: 'black' }}
        renderValue={() =>
          templateSelected
            ? `${templateSelected.title} (ID: ${templateSelected.id})`
            : t('noTemplate')
        }
      >
        {templates
          .filter((template) => template.id !== undefined && template.id !== null)
          .map((template) => (
            <SelectItem key={template.id!.toString()}>
              {template.title} (ID: {template.id})
            </SelectItem>
          ))}
      </Select>
      <Input
        label={t('taskNameLabel')}
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        isRequired
        isInvalid={!!errors.title}
        errorMessage={errors.title}
      />

      <Textarea
        label={t('taskDescriptionLabel')}
        name="description"
        value={formData.description || ""}
        onChange={handleInputChange}
        minRows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('dueDateLabel')}
          name="deadline"
          type="date"
          value={formData.deadline || ""}
          onChange={handleInputChange}
          isRequired
          isInvalid={!!errors.deadline}
          errorMessage={errors.deadline}
        />

        <div className="flex items-center h-full pt-6">
          <Switch
            isSelected={formData.active}
            onValueChange={handleSwitchChange}
          >
            {t('activeLabel')}
          </Switch>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t('supervisorLabel')}
          selectedKeys={[formData.userIdSupervisor.toString()]}
          onChange={(e) => handleSupervisorChange(e.target.value)}
          isRequired
          isInvalid={!!errors.userIdSupervisor}
          errorMessage={errors.userIdSupervisor}
          renderValue={() => {
            const selectedUser = users.find(u => u.id === Number(formData.userIdSupervisor));
            return selectedUser
              ? `${selectedUser.UserProfile?.name} (${selectedUser.UserProfile?.role})`
              : t('selectSupervisor');
          }}
        >
          {users.map((user) => (
            <SelectItem key={user.id.toString()}>
              {user.UserProfile?.name} ({user.UserProfile?.role})
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">{t('associatesLabel')}</p>
        <Select
          label={t('associatesLabel')}
          selectionMode="multiple"
          selectedKeys={formData.usersIdAssociate.map(id => id.toString())}
          isRequired
          isInvalid={!!errors.usersIdAssociates}
          errorMessage={errors.usersIdAssociates}
          onSelectionChange={(keys) => {
            // keys can be a Set or array depending on your Select implementation
            const ids = Array.from(keys as Set<string>).map(id => parseInt(id));
            setFormData(prev => ({ ...prev, usersIdAssociate: ids }));
          }}
          className="mb-4"
          placeholder={t('selectAssociates')}
          isMultiline
          renderValue={(selected) => {
            // Show selected user names in the field
            const selectedUsers = users.filter(u => formData.usersIdAssociate.includes(u.id));
            return selectedUsers.length
              ? selectedUsers.map(u => u.UserProfile?.name).join(", ")
              : t('selectAssociates');
          }}
        >
          {users.map((user) => (
            <SelectItem key={user.id.toString()}>
              {user.UserProfile?.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Divider />

      <TaskChecklists />

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">{t('attachedFilesLabel')}</p>
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
          <p className="text-default-400 text-sm">{t('noFilesAttached')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <Chip
                key={idx}
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
          {t('cancel')}
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
        >
          {isEditMode ? t('updateTask') : t('createTask')}
        </Button>
      </div>

      {/* File Selection Modal */}
      <Modal isOpen={isFileModalOpen} onOpenChange={onFileModalOpenChange} size="lg" className="max-w-xl"
        scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('manageFiles')}</ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  <FileUploader />

                  <Divider />

                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('selectFromExistingFiles')}</h3>
                    {files.length === 0 ? (
                      <div className="text-center p-8 bg-default-50 rounded-medium">
                        <Icon icon="lucide:file" className="mx-auto mb-2 text-default-400" width={32} height={32} />
                        <p className="text-default-600">{t('noFilesAvailable')}</p>
                        <p className="text-default-400 text-sm">{t('uploadFilesUsingForm')}</p>
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
                    {selectedFiles.length} {t('file')} {selectedFiles.length !== 1 ? t('s') : ''}
                  </div>
                  <Button variant="flat" onPress={onClose}>
                    {t('doneButton')}
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