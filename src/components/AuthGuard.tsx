'use client';

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import authService from "@/services/auth.service";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      // Optionally redirect if already on login
      if (pathname === "/login") {
        router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [router, pathname]);

  return <>{children}</>;
}