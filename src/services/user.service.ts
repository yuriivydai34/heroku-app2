import { UserData, UserProfileData } from "@/types";
import { authService } from "./auth.service";

class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async getUsers(params: Record<string, any>): Promise<UserData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const responseData = await response.json();
      return responseData || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async fetchProfile(): Promise<UserProfileData> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/user-profile`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      return response.json();

    } catch (error) {
      console.error('Error fetching profile:', error);
      return [];
    }
  }

  async updateProfile(profileData: Partial<UserProfileData>): Promise<UserProfileData> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/user-profile`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
export default userService;
