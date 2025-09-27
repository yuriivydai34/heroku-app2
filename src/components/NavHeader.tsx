'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { Button } from "@heroui/react";

const NavHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 onClick={() => router.push('/dashboard')} className="text-3xl font-bold text-gray-900">CRM задачі</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button type="button"
                onClick={() => router.back()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Назад
              </Button>
              <Button type="button"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Вийти
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavHeader;
