import { Task } from "../types";
import authService from "./auth.service";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const TaskService = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch tasks');
    }

    const data = await response.json();

    // Ensure always return an array
    if (data && Array.isArray(data)) {
      return data as Task[];
    }
    return [];
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task | undefined> => {
    const response = await fetch(`${baseUrl}/tasks/${id}`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      return undefined;
    }

    const task = await response.json();
    return task as Task | undefined;
  },

  // Create a new task
  createTask: async (task: Task): Promise<Task> => {
    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const newTask = await response.json();
    return newTask as Task;
  },

  // Update an existing task
  updateTask: async (task: Task): Promise<Task> => {
    const response = await fetch(`${baseUrl}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const updatedTask = await response.json();
    return updatedTask as Task;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    const response = await fetch(`${baseUrl}/tasks/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    return true;
  },
};
