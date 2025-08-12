'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (authService.isAuthenticated()) {
      // Redirect to dashboard if logged in
      router.push('/dashboard');
    } else {
      // Redirect to login if not logged in
      router.push('/login');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
