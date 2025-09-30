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

interface NavbarComponentProps {
  onLogout: () => void;
}

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Set initial theme based on prefers-color-scheme or existing class
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches ||
      document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      return nextTheme;
    });
  };

  return (
    <Button
      variant="light"
      color="primary"
      size="sm"
      startContent={<Icon icon={theme === "dark" ? "lucide:moon" : "lucide:sun"} />}
      onPress={handleToggleTheme}
      aria-label="Toggle theme"
      className="mx-2"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </Button>
  );
};

export const NavbarComponent: React.FC<NavbarComponentProps> = ({ onLogout }) => {
  return (
    <Navbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Icon icon="lucide:check-square" className="text-primary text-2xl mr-2" />
        <p className="font-bold text-inherit">TaskManager</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" href="#" aria-current="page">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Calendar
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Reports
          </Link>
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
                src="https://img.heroui.chat/image/avatar?w=40&h=40&u=1"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <a href="/profile">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">admin@company.com</p>
                </a>
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Icon icon="lucide:settings" />}>
                Settings
              </DropdownItem>
              <DropdownItem key="team" startContent={<Icon icon="lucide:users" />}>
                Team
              </DropdownItem>
              <DropdownItem key="analytics" startContent={<Icon icon="lucide:bar-chart" />}>
                Analytics
              </DropdownItem>
              <DropdownItem key="help" startContent={<Icon icon="lucide:help-circle" />}>
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<Icon icon="lucide:log-out" />} onClick={onLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};