import { authService } from "./auth.service";

class MessageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async getMessages(): Promise<MessageResponse[]> {
    try {
      if (!authService.isAuthenticated()) {
        return [{
          success: false,
          message: 'User not authenticated',
        }];
      }

      const response = await fetch(`${this.baseUrl}/message`, {
        method: 'GET',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch messages');
      }

      const responseData = await response.json();
      return responseData || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async getMessage(id: number): Promise<MessageResponse> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/message/${id}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch message');
      }

      const responseData = await response.json();
      return responseData || null;
    } catch (error) {
      console.error('Error fetching message:', error);
      return { success: false, message: 'Error fetching message' };
    }
  }
}

// Export a singleton instance
export const messageService = new MessageService();
export default messageService;
