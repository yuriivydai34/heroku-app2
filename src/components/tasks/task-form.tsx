import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";
import { Task } from "../../types/task";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  editTask: Task | null;
}

const priorityOptions = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export function TaskForm({ isOpen, onClose, onSave, editTask }: TaskFormProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("Medium");
  const [dueDate, setDueDate] = React.useState("");

  // Reset form or populate with task data when editTask changes
  React.useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setPriority(editTask.priority);
      setDueDate(formatDateForInput(editTask.dueDate));
    } else {
      resetForm();
    }
  }, [editTask, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !dueDate) return;

    const task: Task = {
      id: editTask?.id || crypto.randomUUID(),
      title,
      description,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      completed: editTask?.completed || false,
      createdAt: editTask?.createdAt || new Date().toISOString(),
    };

    onSave(task);
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{editTask ? "Edit Task" : "Add New Task"}</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Title"
                  placeholder="Enter task title"
                  value={title}
                  onValueChange={setTitle}
                  isRequired
                />
                <Input
                  label="Description"
                  placeholder="Enter task description"
                  value={description}
                  onValueChange={setDescription}
                />
                <Select
                  label="Priority"
                  placeholder="Select priority"
                  selectedKeys={[priority]}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="date"
                  label="Due Date"
                  placeholder="Select due date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {editTask ? "Update" : "Create"} Task
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}