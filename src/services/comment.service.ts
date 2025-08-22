import authService from './auth.service';

interface CommentData {
  id?: string;
  content: string;
  taskId?: number;
  userId?: number;
  createdAt?: string;
  [key: string]: any; // Allow for additional comment fields
}

interface CommentResponse {
  success: boolean;
  data?: CommentData | CommentData[];
  message?: string;
}

class CommentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async fetchComments(taskId?: string): Promise<CommentResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const url = taskId 
        ? `${this.baseUrl}/comments?taskId=${taskId}`
        : `${this.baseUrl}/comments`;

      const response = await fetch(url, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch comments');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Comments fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load comments',
      };
    }
  }

  async fetchComment(commentId: string): Promise<CommentResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch comment');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Comment fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load comment',
      };
    }
  }

  async createComment(commentData: Omit<CommentData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommentResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/comments`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create comment');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Comment created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create comment',
      };
    }
  }

  async updateComment(commentId: string, commentData: Partial<CommentData>): Promise<CommentResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update comment');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Comment updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update comment',
      };
    }
  }

  async deleteComment(commentId: string): Promise<CommentResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      return {
        success: true,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete comment',
      };
    }
  }

  async fetchTaskComments(taskId: string): Promise<CommentResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/tasks/${taskId}/comments`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch task comments');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Task comments fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load task comments',
      };
    }
  }

  async createTaskComment(taskId: string, content: string): Promise<CommentResponse> {
    return this.createComment({
      content,
      taskId,
    });
  }
}

// Export a singleton instance
export const commentService = new CommentService();
export default commentService;
