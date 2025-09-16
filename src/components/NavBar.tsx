'use client';

import authService from "@/services/auth.service";
import { Navbar, NavbarBrand, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  return (
    <Navbar className="bg-gray-800 p-4">
      <NavbarBrand>
        <h1 className="text-white text-2xl">My CRM</h1>
      </NavbarBrand>
      <Button variant="solid" className="ml-auto" onClick={handleLogout}>
        Logout
      </Button>
    </Navbar>
  );
}