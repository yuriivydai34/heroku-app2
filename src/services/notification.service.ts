import { authService } from "./auth.service";

class NotificationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async getNotifications(): Promise<NotificationResponse[]> {
    try {
      if (!authService.isAuthenticated()) {
        return [{
          success: false,
          message: 'User not authenticated',
        }];
      }

      const response = await fetch(`${this.baseUrl}/notification`, {
        method: 'GET',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch notifications');
      }

      const responseData = await response.json();
      return responseData || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  markAsRead(notificationIds: number[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!authService.isAuthenticated()) {
          reject(new Error('User not authenticated'));
          return;
        }

        const response = await fetch(`${this.baseUrl}/notification`, {
          method: 'PUT',
          headers: authService.getAuthHeaders(),
          body: JSON.stringify({ ids: notificationIds })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to mark notifications as read');
        }

        resolve();
      } catch (error) {
        console.error('Error marking notifications as read:', error);
        reject(error);
      }
    });
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
export default notificationService;
