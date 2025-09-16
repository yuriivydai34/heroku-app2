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
      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.message ?? 'Login failed');
      }
    } catch (error) {
      setError('Login error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Sign in to your account</h2>
        {error && <Error message={error} />}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            name="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            required
            variant="flat"
            className="w-full"
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            variant="flat"
            className="w-full"
          />
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full mt-4"
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}