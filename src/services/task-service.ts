import { Task } from "../types";
import { v4 as uuidv4 } from "uuid";

// Mock storage for tasks
let tasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new project",
    active: true,
    deadline: "2024-08-15",
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-07-01T10:00:00Z",
    userIdCreator: 1,
    usersIdAssociate: [2, 3],
    userIdSupervisor: 4,
    files: []
  },
  {
    id: "2",
    title: "Design new user interface",
    description: "Create wireframes and mockups for the new UI",
    active: true,
    deadline: "2024-07-30",
    createdAt: "2024-07-05T09:30:00Z",
    updatedAt: "2024-07-05T09:30:00Z",
    userIdCreator: 2,
    usersIdAssociate: [1, 3],
    userIdSupervisor: 4,
    files: []
  }
];

export const TaskService = {
  // Get all tasks
  getAllTasks: (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...tasks]);
      }, 500);
    });
  },

  // Get task by ID
  getTaskById: (id: string): Promise<Task | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = tasks.find(t => t.id === id);
        resolve(task ? { ...task } : undefined);
      }, 300);
    });
  },

  // Create a new task
  createTask: (task: Task): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...task,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          active: task.active !== undefined ? task.active : true,
          files: task.files || []
        };
        tasks = [...tasks, newTask];
        resolve({ ...newTask });
      }, 500);
    });
  },

  // Update an existing task
  updateTask: (task: Task): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!task.id) {
          reject(new Error("Task ID is required for update"));
          return;
        }
        
        const index = tasks.findIndex(t => t.id === task.id);
        if (index === -1) {
          reject(new Error(`Task with ID ${task.id} not found`));
          return;
        }
        
        const updatedTask: Task = {
          ...task,
          updatedAt: new Date().toISOString()
        };
        
        tasks = [
          ...tasks.slice(0, index),
          updatedTask,
          ...tasks.slice(index + 1)
        ];
        
        resolve({ ...updatedTask });
      }, 500);
    });
  },

  // Delete a task
  deleteTask: (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) {
          reject(new Error(`Task with ID ${id} not found`));
          return;
        }
        
        tasks = [
          ...tasks.slice(0, index),
          ...tasks.slice(index + 1)
        ];
        
        resolve(true);
      }, 500);
    });
  }
};
