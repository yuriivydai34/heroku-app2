import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  // On mount, set theme from localStorage or system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    let isDark: boolean;
    if (savedTheme) {
      isDark = savedTheme === "dark";
    } else {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches ||
        document.documentElement.classList.contains("dark");
    }
    setTheme(isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      localStorage.setItem("theme", nextTheme); // Save to localStorage
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