// src/components/AdminGuard.tsx
'use client';

import { useRouter } from "next/navigation";
import React from "react";
import authService from "@/services/auth.service";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = await authService.getCurrentUser();

        if (!user || user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        router.push('/dashboard');
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return <div>Checking admin access...</div>;
  }

  return <>{children}</>;
};

export default AdminGuard;