'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import authService from '../../../services/auth.service';
import NavHeader from '@/components/NavHeader';
import ErrorMessage from '@/components/ErrorMessage';
import taskTemplateService from '@/services/taskTemplate.service';
import TaskTemplateContent from '@/components/TaskTemplateContent';
import { Button } from '@heroui/react';

interface TaskTemplateData {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
}

export default function TaskTemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState<TaskTemplateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (templateId) {
      loadTemplate();
    }
  }, [router, templateId]);

  const loadTemplate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskTemplateService.fetchTaskTemplate(templateId);

      if (response.success && response.data && !Array.isArray(response.data)) {
        setTemplate(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description || '',
        });
      } else {
        setError(response.message || 'Failed to load template');
      }
    } catch (err) {
      setError('An error occurred while loading the template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!template?.id || !editForm.title.trim()) {
      setError('Template title is required');
      return;
    }

    try {
      const response = await taskTemplateService.updateTaskTemplate(template.id, {
        title: editForm.title,
        description: editForm.description,
      });

      if (response.success) {
        setIsEditing(false);
        loadTemplate(); // Reload template
        setError(null);
      } else {
        setError(response.message || 'Failed to update template');
      }
    } catch (err) {
      setError('An error occurred while updating the template');
    }
  };

  const handleDeleteTemplate = async () => {
    if (!template?.id || !confirm('Ви впевнені що хочете видалити?')) {
      return;
    }

    try {
      const response = await taskTemplateService.deleteTaskTemplate(template.id);

      if (response.success) {
        router.push('/task-template');
      } else {
        setError(response.message || 'Failed to delete template');
      }
    } catch (err) {
      setError('An error occurred while deleting the template');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h2>
          <p className="text-gray-600 mb-6">The template you're looking for doesn't exist.</p>
          <Button
            onClick={() => router.push('/task-template')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NavHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} setError={setError} />
          )}

          {/* Template Content */}
          <TaskTemplateContent
            template={template} isEditing={isEditing}
            setIsEditing={setIsEditing} setEditForm={setEditForm}
            handleUpdateTemplate={handleUpdateTemplate} editForm={editForm}
            handleDeleteTemplate={handleDeleteTemplate} />
        </div>
      </main>
    </div>
  );
}
