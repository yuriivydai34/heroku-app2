import authService from './auth.service';

interface TaskTemplateData {
  id?: string;
  title: string;
  description: string;
  [key: string]: any; // Allow for additional task fields
}

interface TaskTemplateResponse {
  success: boolean;
  data?: TaskTemplateData | TaskTemplateData[];
  message?: string;
}

class TaskTemplateService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async fetchTaskTemplates(): Promise<TaskTemplateResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-template`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task templates');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task templates fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load task templates',
      };
    }
  }

  async fetchTaskTemplate(templateId: string): Promise<TaskTemplateResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-template/${templateId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task template');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task template fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load task template',
      };
    }
  }

  async createTaskTemplate(taskData: Omit<TaskTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskTemplateResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-template`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create task template');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task template created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create task template',
      };
    }
  }

  async updateTaskTemplate(templateId: string, taskData: Partial<TaskTemplateData>): Promise<TaskTemplateResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-template/${templateId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update task template');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task template updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update task template',
      };
    }
  }

  async deleteTaskTemplate(templateId: string): Promise<TaskTemplateResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-template/${templateId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete task template');
      }

      return {
        success: true,
        message: 'Task template deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete task template',
      };
    }
  }
}

// Export a singleton instance
export const taskTemplateService = new TaskTemplateService();
export default taskTemplateService;
