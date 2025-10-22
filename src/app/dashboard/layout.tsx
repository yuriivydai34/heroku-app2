'use client';

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { NavbarComponent } from "@/components/navbar";
import { authService } from "@/services/auth.service";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useDisclosure } from "@heroui/react";
import { UserProvider } from "@/context/user-context";
import { NotificationProvider } from "@/context/notification-context";
import ProfileModal from "@/components/profile-modal";
import NotificationModal from "@/components/notification-modal";
import DashboardTabs from "@/components/dashboard-tabs";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isOpen: isProfileOpen,
    onOpenChange: onProfileOpenChange
  } = useDisclosure();

  const {
    isOpen: isNotificationOpen,
    onOpenChange: onNotificationOpenChange
  } = useDisclosure();

  const t = useTranslations('DashboardPage');

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  }

  const onOpenAdmin = () => {
    router.push('/admin');
  }

  return (
    <UserProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-background p-4 md:p-8">
          {/* Navbar */}
          <NavbarComponent 
            onLogout={handleLogout} 
            onOpenProfile={onProfileOpenChange} 
            onOpenNotification={onNotificationOpenChange} 
            onOpenAdmin={onOpenAdmin} 
          />

          {/* Main Content */}
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>

            <ProfileModal isOpen={isProfileOpen} onOpenChange={onProfileOpenChange} />
            <NotificationModal isOpen={isNotificationOpen} onOpenChange={onNotificationOpenChange} />
            
            <Card className="mb-8">
              <CardBody className="p-0">
                <DashboardTabs currentPath={pathname} />
                {children}
              </CardBody>
            </Card>
          </div>
        </div>
      </NotificationProvider>
    </UserProvider>
  );
}