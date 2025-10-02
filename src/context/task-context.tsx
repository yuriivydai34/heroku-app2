import React from "react";
import { Task } from "../types";
import { TaskService } from "../services/task-service";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Task) => Promise<Task>;
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  selectTask: (task: Task | null) => void;
  handleSort: (column: string) => void;
}

const TaskContext = React.createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  fetchTasks: async () => {},
  createTask: async () => ({} as Task),
  updateTask: async () => ({} as Task),
  deleteTask: async () => false,
  selectTask: () => {},
  handleSort: () => {},
});

export const useTaskContext = () => React.useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const fetchTasks = React.useCallback(async ({ sortBy, sortOrder }: { sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await TaskService.getAllTasks({ sort: { sortBy: sortBy ?? "id", sortOrder: sortOrder ?? "asc" } });
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = React.useCallback(async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await TaskService.createTask(task);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = React.useCallback(async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await TaskService.updateTask(task);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      if (selectedTask?.id === task.id) {
        setSelectedTask(updatedTask);
      }
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  const deleteTask = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await TaskService.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (selectedTask?.id === id) {
          setSelectedTask(null);
        }
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  const selectTask = React.useCallback((task: Task | null) => {
    setSelectedTask(task);
  }, []);

  async function handleSort(column: string): Promise<void> {
    // Implement sorting logic here
    console.log(`Sorting by ${column}`);
    await fetchTasks({ sortBy: column, sortOrder: 'asc' });
  }

  React.useEffect(() => {
    fetchTasks({});
  }, [fetchTasks]);

  const value = {
    tasks,
    loading,
    error,
    selectedTask,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
    handleSort,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
