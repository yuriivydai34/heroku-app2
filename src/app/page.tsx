'use client';

import { Spinner, Card } from '@heroui/react'; // Import HeroUI components

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center bg-gray-800">
        <Spinner size="lg" color="primary" className="mx-auto" />
        <p className="mt-4 text-gray-300">Redirecting...</p>
      </Card>
    </div>
  );
}