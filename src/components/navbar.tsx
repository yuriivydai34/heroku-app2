'use client';

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { useUserContext } from "@/context/user-context";
import { useNotificationContext } from "@/context/notification-context";
import { useTranslations } from 'next-intl';

interface NavbarComponentProps {
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenNotification: () => void;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = ({ onLogout, onOpenProfile, onOpenNotification }) => {
  const { profile } = useUserContext();
  const { notifications } = useNotificationContext();

  const t = useTranslations('Navbar');

  return (
    <Navbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Icon icon="lucide:check-square" className="text-primary text-2xl mr-2" />
        <p className="font-bold text-inherit">{t('title')}</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" href="#" aria-current="page">
            {t('home')}
          </Link>
          <Button
            variant="light"
            color="primary"
            size="sm"
            startContent={<Icon icon="lucide:bell" />}
            onPress={onOpenNotification}
            aria-label={t('notifications')}
            className="mx-2"
          >
            {t('notifications')} {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-1 inline-block bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitcher />
        <LanguageSwitcher />

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                size="sm"
                src={profile?.avatarUrl}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" onClick={onOpenProfile}>
                <p className="font-semibold">{t('profile')}</p>
                <p className="font-semibold">{profile?.name}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<Icon icon="lucide:log-out" />} onClick={onLogout}>
                {t('logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};