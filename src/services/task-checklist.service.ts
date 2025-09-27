import authService from './auth.service';
import { Checklist } from '@/types';
import { TaskChecklistResponse } from '@/types';

class TaskChecklistsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async getTaskChecklists(taskId: number): Promise<TaskChecklistResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const url = new URL(`${this.baseUrl}/task-checklists/for-task/${taskId}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task checklists');
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: 'Task checklists fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load task checklists',
      };
    }
  }

  async getTaskChecklistById(checklistId: string): Promise<TaskChecklistResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-checklists/${checklistId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task checklist');
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: 'Task checklist fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load task checklist',
      };
    }
  }

  async createTaskChecklist(checklistsData: Checklist[]): Promise<TaskChecklistResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      for (const checklist of checklistsData) {
        await fetch(`${this.baseUrl}/task-checklists`, {
          method: 'POST',
          headers: authService.getAuthHeaders(),
          body: JSON.stringify(checklist),
        });
      }

      return {
        success: true,
        data: checklistsData,
        message: 'Task checklist created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create task checklist',
      };
    }
  }

  async updateTaskChecklist(checklistId: string, checklistData: Partial<Checklist>): Promise<TaskChecklistResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-checklists/${checklistId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(checklistData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update task checklist');
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

  async deleteTaskChecklist(checklistId: string): Promise<TaskChecklistResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/task-checklists/${checklistId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete task checklist');
      }

      return {
        success: true,
        message: 'Task checklist deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete task checklist',
      };
    }
  }
}

// Export a singleton instance
export const taskChecklistsService = new TaskChecklistsService();
export default taskChecklistsService;