'use client';

import Chat from "@/components/Chat";
import authService from "../../services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavHeader from "@/components/NavHeader";
import ErrorMessage from "@/components/ErrorMessage";

export default function ChatPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      setError("You must be logged in to access this page.");
      router.push('/login');
    } else {
      setIsLoading(false);
      setError(null);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NavHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} setError={setError} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}