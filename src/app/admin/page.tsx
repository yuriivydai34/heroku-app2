'use client';

import AdminGuard from "@/components/AdminGuard";
import { NavbarComponent } from "@/components/navbar";
import NotificationModal from "@/components/notification-modal";
import ProfileModal from "@/components/profile-modal";
import { NotificationProvider } from "@/context/notification-context";
import { UserProvider } from "@/context/user-context";
import authService from "@/services/auth.service";
import { useDisclosure } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

const AdminPage = () => {
  const router = useRouter();

  const {
    isOpen: isProfileOpen,
    onOpenChange: onProfileOpenChange
  } = useDisclosure();

  const {
    isOpen: isNotificationOpen,
    onOpenChange: onNotificationOpenChange
  } = useDisclosure();

  const t = useTranslations('AdminPage');

  const handleLogout = async () => {
    // Clear any authentication tokens or session data here
    await authService.logout();

    // Redirect to login page
    router.push('/login');
  }

  const onOpenAdmin = () => {
    router.push('/admin');
  }

  return (
    <AdminGuard>
      <UserProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-background p-4 md:p-8">
            {/* Navbar */}
            <NavbarComponent onLogout={handleLogout} onOpenProfile={onProfileOpenChange} onOpenNotification={onNotificationOpenChange} onOpenAdmin={onOpenAdmin} />

            {/* Main Content */}
            <div className="container mx-auto max-w-6xl">
              <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
              <ProfileModal isOpen={isProfileOpen} onOpenChange={onProfileOpenChange} />
              <NotificationModal isOpen={isNotificationOpen} onOpenChange={onNotificationOpenChange} />
              <p>Welcome to the admin panel.</p>
            </div>
          </div>
        </NotificationProvider>
      </UserProvider>
    </AdminGuard>
  );
};

export default AdminPage;
