'use client';

import React from "react";
import { Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "./theme-switch";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";

export function SidebarNavigation() {
  const router = useRouter();

  const handleLogout = async () => {
    // Implement your logout logic here
    await authService.logout();

    console.log("User logged out");
    router.push("/login");
  }
  
  return (
    <div className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-center gap-2 px-2 py-4">
        <Icon icon="lucide:boxes" className="text-2xl" />
        <span className="font-bold text-xl">Dashboard</span>
      </div>
      <ThemeSwitch />
      <div className="flex flex-col gap-1">
        {siteConfig.navigationItems.map((item) => {
          return (
            <Link
              key={item.name}
              href={item.href} // Changed from href to to for RouterLink compatibility
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-default-100`}
            >
              <Icon icon={item.icon} className="text-xl" />
              {item.name}
            </Link>
          );
        })}
      </div>
      <Button variant="flat" className="mt-auto" onClick={handleLogout}>Logout</Button>
    </div>
  );
}