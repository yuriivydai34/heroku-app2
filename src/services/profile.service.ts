import authService from './auth.service';

class ProfileService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async fetchProfile(): Promise<ProfileResponse> {
    try {
      // Check if user is authenticated first
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const response = await fetch(`${this.baseUrl}/user-profile`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Profile fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load profile',
      };
    }
  }

  async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileResponse> {
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

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }
}

// Export a singleton instance
export const profileService = new ProfileService();
export default profileService;
