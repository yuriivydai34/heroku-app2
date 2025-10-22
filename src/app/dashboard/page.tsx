'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default tab (tasks)
    router.replace('/dashboard/tasks');
  }, [router]);

  return null; // This page will redirect immediately
}