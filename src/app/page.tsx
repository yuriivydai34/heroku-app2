'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { Spinner, Card } from '@heroui/react'; // Import HeroUI components

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="p-8 text-center bg-gray-800">
        <Spinner size="lg" color="primary" className="mx-auto" />
        <p className="mt-4 text-gray-300">Redirecting...</p>
      </Card>
    </div>
  );
}