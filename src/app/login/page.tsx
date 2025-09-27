'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import { Button, Input, Card } from '@heroui/react';
import { LoginFormData, LoginFormErrors } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      setSubmitMessage('Login successful! Redirecting...');

      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-content1 text-content1 transition-colors">
      <Card className="max-w-md w-full p-8 bg-content2 text-content1 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-extrabold" style={{ color: "#000" }}>
          Увійдіть до системи
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Користувач"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Введіть ім'я користувача"
            isRequired
            color={errors.username ? "danger" : "default"}
            variant="bordered"
            className="w-full"
            autoFocus
          />
          {errors.username && (
            <div className="text-sm text-danger">{errors.username}</div>
          )}
          <Input
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Введіть пароль"
            isRequired
            color={errors.password ? "danger" : "default"}
            variant="bordered"
            className="w-full"
          />
          {errors.password && (
            <div className="text-sm text-danger">{errors.password}</div>
          )}
          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Входимо...' : 'Увійти'}
          </Button>
          {submitMessage && (
            <div className={`text-center text-sm ${submitMessage.includes('successful') ? 'text-success' : 'text-danger'}`}>
              {submitMessage}
            </div>
          )}
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm" style={{ color: "#000" }}>
            Ще не зареєстровані?{' '}
          </span>
          <Button
            variant="light"
            color="primary"
            onClick={handleRegisterRedirect}
            className="font-medium underline"
          >
            Створіть користувача
          </Button>
        </div>
      </Card>
    </div>
  );
}