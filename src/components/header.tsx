'use client';

import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

export function Header() {
  return (
    <header className="border-default-200 flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <Button isIconOnly variant="light">
          <Icon icon="lucide:search" className="text-xl" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button isIconOnly variant="light">
          <Icon icon="lucide:bell" className="text-xl" />
        </Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              className="transition-transform"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">john@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team">Team Settings</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
