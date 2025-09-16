import React from "react";
import { Card, CardHeader, CardBody, Button, useDisclosure, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { Task } from "@/types/task";
import { addToast } from "@heroui/react";

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete dashboard design",
    description: "Finish the UI design for the analytics dashboard",
    priority: "High",
    dueDate: "2024-06-15T00:00:00.000Z",
    completed: false,
    createdAt: "2024-06-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Review and merge pending pull requests",
    priority: "Medium",
    dueDate: "2024-06-10T00:00:00.000Z",
    completed: true,
    createdAt: "2024-06-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    priority: "Low",
    dueDate: "2024-06-20T00:00:00.000Z",
    completed: false,
    createdAt: "2024-06-03T00:00:00.000Z",
  },
];

export function TasksManager() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleAddTask = () => {
    setEditTask(null);
    onOpen();
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    onOpen();
  };

  const handleSaveTask = (task: Task) => {
    if (editTask) {
      // Update existing task
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      addToast({
        title: "Task updated",
        description: "The task has been updated successfully",
        severity: "success",
      });
    } else {
      // Add new task
      setTasks([...tasks, task]);
      addToast({
        title: "Task created",
        description: "New task has been created successfully",
        severity: "success",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    addToast({
      title: "Task deleted",
      description: "The task has been deleted successfully",
      severity: "danger",
    });
  };

  const handleStatusChange = (id: string, completed: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed } : task
      )
    );
    addToast({
      title: `Task ${completed ? "completed" : "reopened"}`,
      description: `The task has been marked as ${completed ? "completed" : "pending"}`,
      severity: "success",
    });
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:check-square" className="text-xl" />
          <h3 className="text-lg font-semibold">Tasks</h3>
        </div>
        <Tooltip content="Add new task">
          <Button color="primary" onPress={handleAddTask} startContent={<Icon icon="lucide:plus" />}>
            Add Task
          </Button>
        </Tooltip>
      </CardHeader>
      <CardBody>
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </CardBody>
      <TaskForm
        isOpen={isOpen}
        onClose={onOpenChange}
        onSave={handleSaveTask}
        editTask={editTask}
      />
    </Card>
  );
}