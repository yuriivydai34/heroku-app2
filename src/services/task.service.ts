import authService from './auth.service';

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  userIdAssociate: number;
  userIdSupervisor: number;
  [key: string]: any; // Allow for additional task fields
}

interface TaskResponse {
  success: boolean;
  data?: TaskData | TaskData[];
  message?: string;
}

class TaskService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async fetchTasks(): Promise<TaskResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Tasks fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load tasks',
      };
    }
  }

  async fetchTask(taskId: string): Promise<TaskResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load task',
      };
    }
  }

  async createTask(taskData: Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create task');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create task',
      };
    }
  }

  async updateTask(taskId: string, taskData: Partial<TaskData>): Promise<TaskResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update task');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update task',
      };
    }
  }

  async deleteTask(taskId: string): Promise<TaskResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete task');
      }

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete task',
      };
    }
  }

  async markTaskComplete(taskId: string): Promise<TaskResponse> {
    return this.updateTask(taskId, { status: 'completed' });
  }

  async markTaskInProgress(taskId: string): Promise<TaskResponse> {
    return this.updateTask(taskId, { status: 'in-progress' });
  }

  async markTaskPending(taskId: string): Promise<TaskResponse> {
    return this.updateTask(taskId, { status: 'pending' });
  }
}

// Export a singleton instance
export const taskService = new TaskService();
export default taskService;
