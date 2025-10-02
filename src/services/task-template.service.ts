import { TaskSort, TaskTemplateData } from '@/types';
import authService from './auth.service';

class TaskTemplateService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async fetchTaskTemplates(params: { sort?: TaskSort }): Promise<TaskTemplateData[]> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const url = new URL(`${this.baseUrl}/task-template`);

    if (params.sort) {
      url.searchParams.append('sort', JSON.stringify(params.sort));
    }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task templates');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to load task templates');
    }
  }

  async fetchTaskTemplate(templateId: number): Promise<TaskTemplateData> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/task-template/${templateId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task template');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to load task template');
    }
  }

  async createTaskTemplate(taskData: Omit<TaskTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskTemplateData> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
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

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create task template');
    }
  }

  async updateTaskTemplate(templateId: number, taskData: Partial<TaskTemplateData>): Promise<TaskTemplateData> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
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

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update task template');
    }
  }

  async deleteTaskTemplate(templateId: number): Promise<TaskTemplateData> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/task-template/${templateId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete task template');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete task template');
    }
  }
}

// Export a singleton instance
export const taskTemplateService = new TaskTemplateService();
export default taskTemplateService;