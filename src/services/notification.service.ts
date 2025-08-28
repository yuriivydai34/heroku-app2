import { authService } from "./auth.service";

interface NotificationData {
  id?: string;
  content: string;
  userId: number;
  read: boolean;
  createdAt?: string;
}

interface NotificationResponse {
  success: boolean;
  data?: NotificationData;
  message?: string;
}

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
}

// Export a singleton instance
export const notificationService = new NotificationService();
export default notificationService;
