interface UserData {
  id: string;
  username: string;
}

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
}

// Export a singleton instance
export const userService = new UserService();
export default userService;
