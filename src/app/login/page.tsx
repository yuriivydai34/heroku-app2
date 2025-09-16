'use client';

import { Card, Input, Button } from '@heroui/react';
import authService, { LoginData } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Error from '@/components/Error';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const response = await authService.login({ username, password } as LoginData);
      // Handle successful login (e.g., redirect or show a success message)
      if (response.success) {
        router.push('/dashboard');
        console.log('Login successful:', response);
      } else {
        setError(response.message ?? 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="p-8 w-full max-w-md">
        {error !== null && <Error message={error} />}
        <h1 className="text-4xl text-white mb-8 text-center">Login Page</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="your_username"
              variant="flat"
              color="primary"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              variant="flat"
              color="primary"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            color="primary"
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}