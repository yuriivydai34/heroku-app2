'use client';

import UsersList from "@/components/UsersList";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";

interface UserData {
  id: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userService.getUsers({});
      setUsers(response);
    };
    fetchUsers();
  }, []);
  return (
    <div>
      <UsersList users={users} />
    </div>
  );
}