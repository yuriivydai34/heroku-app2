'use client';

import React, { useEffect } from "react";
import { Card, CardHeader, CardBody, Button, useDisclosure, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { Task } from "@/types/task";
import { addToast } from "@heroui/react";
import taskService from "@/services/task.service";

export function TasksManager() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await taskService.fetchTasks();
      setTasks(response.data as Task[] || []);
    };
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setEditTask(null);
    onOpen();
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    onOpen();
  };

  const handleSaveTask = async (task: Task) => {
    if (editTask) {
      // Update existing task
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));

      if (task.id) {
        await taskService.updateTask(task.id, task);
      } else {
        addToast({
          title: "Task update failed",
          description: "Task ID is missing or invalid",
          severity: "danger",
        });
      }

      addToast({
        title: "Task updated",
        description: "The task has been updated successfully",
        severity: "success",
      });
    } else {
      // Add new task
      setTasks([...tasks, task]);

      await taskService.createTask(task);

      addToast({
        title: "Task created",
        description: "New task has been created successfully",
        severity: "success",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));

    await taskService.deleteTask(id);

    addToast({
      title: "Task deleted",
      description: "The task has been deleted successfully",
      severity: "danger",
    });
  };

  const handleStatusChange = async (id: string, active: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, active } : task
      )
    );

    await taskService.updateTask(id, { active });

    addToast({
      title: `Task ${active ? "active" : "inactive"}`,
      description: `The task has been marked as ${active ? "active" : "inactive"}`,
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