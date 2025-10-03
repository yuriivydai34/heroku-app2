import React, { useEffect, useState } from "react";
import {
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { Icon } from "@iconify/react";

const setLocale = (locale: string) => {
  document.cookie = `locale=${locale}; path=/`;
  window.location.reload();
};

export const LanguageSwitcher: React.FC = () => {
  const [locale, setLocaleState] = useState('ua');

  const localeLabel = locale === 'ua' ? 'Українська' : 'English';

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
    const currentLocale = match ? match[1] : 'ua';

    // Set default cookie if none exists
    if (!match) {
      document.cookie = `locale=ua; path=/`;
    }

    setLocaleState(currentLocale);
  }, []);

  return (
    <>
      <NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button variant="light" color="primary" size="sm" startContent={<Icon icon="lucide:globe" />}>
              {localeLabel}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Language Switcher" variant="flat">
            <DropdownItem key="en" onClick={() => setLocale('en')}>English</DropdownItem>
            <DropdownItem key="ua" onClick={() => setLocale('ua')}>Українська</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    </>
  );
}