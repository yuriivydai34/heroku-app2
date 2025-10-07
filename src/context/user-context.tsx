import React from "react";
import { userService } from "@/services/user.service";
import { UserData, UserProfileData } from "@/types";
import authService from "@/services/auth.service";

interface UserContextType {
  users: UserData[];
  loading: boolean;
  error: string | null;
  profile?: UserProfileData | null;
  updateProfile?: (data: Partial<UserProfileData>) => Promise<UserProfileData>;
  currentUser?: string | null;
}

const UserContext = React.createContext<UserContextType>({
  users: [],
  loading: false,
  error: null,
  profile: {},
  updateProfile: async () => ({} as UserProfileData),
});

export const useUserContext = () => React.useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userService.getUsers({});
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await userService.fetchProfile();
      setProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = React.useCallback(async (data: Partial<UserProfileData>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await userService.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch current user");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
    fetchUsers();
    fetchCurrentUser();
  }, [fetchUsers, fetchProfile, fetchCurrentUser]);

  const value = {
    users,
    loading,
    error,
    profile,
    updateProfile,
    currentUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
