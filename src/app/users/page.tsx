'use client';

import UsersList from "@/components/UsersList";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import NavHeader from "@/components/NavHeader";
import { Button } from "@heroui/react";
import ErrorMessage from '@/components/ErrorMessage';

interface UserData {
  id: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const response = await userService.getUsers({});
      setUsers(response);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NavHeader />

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-500">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <Button
                onClick={() => setSuccess(null)}
                className="text-green-400 hover:text-green-600"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} setError={setError} />
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UsersList users={users} />
        </div>
      </main>
    </div>
  );
}