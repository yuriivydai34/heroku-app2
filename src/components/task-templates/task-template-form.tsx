import React from "react";
import {
  Input,
  Textarea,
  Button,
  Divider,
} from "@heroui/react";
import { TaskTemplateData } from "@/types";
import { useTaskTemplateContext } from "@/context/task-template-context";

interface TaskTemplateFormProps {
  taskTemplate?: TaskTemplateData | null;
  onClose: () => void;
}

export const TaskTemplateForm: React.FC<TaskTemplateFormProps> = ({ taskTemplate, onClose }) => {
  const { createTaskTemplate, updateTaskTemplate } = useTaskTemplateContext();
  const isEditMode = !!taskTemplate;

  const [formData, setFormData] = React.useState<TaskTemplateData>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Initialize form with task template data if in edit mode
  React.useEffect(() => {
    if (taskTemplate) {
      setFormData({
        title: taskTemplate.title || "",
        description: taskTemplate.description || "",
      });
    }
  }, [taskTemplate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && taskTemplate?.id) {
        await updateTaskTemplate({ ...formData, id: taskTemplate.id });
      } else {
        await createTaskTemplate(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task template:", error);
    } finally {
      setLoading(false);
    }
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

      <Divider />

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="flat" onPress={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
        >
          {isEditMode ? "Update Task Template" : "Create Task Template"}
        </Button>
      </div>
    </form>
  );
};