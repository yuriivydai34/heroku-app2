'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';
import { Button, Input, Card } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const t = useTranslations('RegisterPage');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t('usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('usernameMinLength');
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
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

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await authService.register({
        username: formData.username,
        password: formData.password,
      });

      if (!result.success) {
        throw new Error(result.message || t('registrationFailed'));
      }

      setSubmitMessage(t('registrationSuccess'));
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : t('registrationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-content1">
      <Card>
        <h2 className="mb-8 text-center text-3xl font-extrabold" style={{ color: "#000" }}>
          {t('title')}
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            label={t('usernameLabel')}
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder={t('usernamePlaceholder')}
            isRequired
            color={errors.username ? "danger" : "default"}
            variant="bordered"
            autoFocus
          />
          {errors.username && <div style={{ color: "#d32f2f" }}>{errors.username}</div>}
          <Input
            label={t('passwordLabel')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('passwordPlaceholder')}
            isRequired
            color={errors.password ? "danger" : "default"}
            variant="bordered"
          />
          {errors.password && <div style={{ color: "#d32f2f" }}>{errors.password}</div>}
          <Input
            label={t('confirmPasswordLabel')}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('confirmPasswordPlaceholder')}
            isRequired
            color={errors.confirmPassword ? "danger" : "default"}
            variant="bordered"
          />
          {errors.confirmPassword && <div style={{ color: "#d32f2f" }}>{errors.confirmPassword}</div>}
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? t('creatingUser') : t('createUser')}
          </Button>
          {submitMessage && <div className="text-center" style={{ color: submitMessage.includes('successful') ? "#388e3c" : "#d32f2f" }}>
            {submitMessage}
          </div>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm" style={{ color: "#000" }}>
            {t('alreadyRegistered')}{' '}
          </span>
          <Button
            variant="light"
            color="primary"
            onClick={handleLoginRedirect}
            className="font-medium underline"
          >
            {t('loginTitle')}
          </Button>
        </div>
      </Card>
    </div>
  );
}