'use client';

import ErrorMessage from "@/components/ErrorMessage";
import NavHeader from "@/components/NavHeader";
import taskTemplateService from "@/services/taskTemplate.service";
import { useEffect, useState } from "react";
import authService from '../../services/auth.service';
import { useRouter } from 'next/navigation';
import TaskTemplatesList from "@/components/TaskTemplatesList";
import CreateTaskTemplatesForm from "@/components/CreateTaskTemplatesForm";
import { Button } from "@heroui/react";

// Define TaskTemplateData type or import it from the correct location
type TaskTemplateData = {
  id?: string;
  title: string;
  description: string;
};

export default function TaskTemplatePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TaskTemplateData[]>([]);
  const router = useRouter();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTemplate, setNewTemplate] = useState<TaskTemplateData>({
      title: '',
      description: ''
    });

 useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadTemplates();
  }, [router]);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskTemplateService.fetchTaskTemplates();

      if (response.success && Array.isArray(response.data)) {
        setTemplates(response.data);
      } else {
        setError(response.message || 'Failed to load templates');
      }
    } catch (err) {
      setError('An error occurred while loading templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTemplate.title.trim()) {
      setError('Template title is required');
      return;
    }

    try {
      const response = await taskTemplateService.createTaskTemplate({
        title: newTemplate.title,
        description: newTemplate.description,
      });

      if (response.success) {
        setNewTemplate({ title: '', description: '' });
        setShowCreateForm(false);
        loadTemplates(); // Reload templates
      } else {
        setError(response.message || 'Failed to create template');
      }
    } catch (err) {
      setError('An error occurred while creating the template');
    }
  };

    const handleDeleteTemplate = async (templateId: string) => {
      if (!confirm('Ви впевнені що хочете видалити?')) {
        return;
      }
  
      try {
        const response = await taskTemplateService.deleteTaskTemplate(templateId);

        if (response.success) {
          loadTemplates(); // Reload templates
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
          <p className="mt-4 text-gray-600">Loading templates...</p>
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

          {/* Create Task Template Form */}
          {showCreateForm && (
            <div className="mb-6 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {showCreateForm ? 'Скасувати' : 'New Task Template'}
                </Button>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Cтворення нового шаблона
                </h3>
                <CreateTaskTemplatesForm
                  handleCreateTemplate={handleCreateTemplate} newTemplate={newTemplate}
                  setNewTemplate={setNewTemplate} setShowCreateForm={setShowCreateForm}
                /></div>
            </div>
          )}

          {/* Task Templates List */}
          <TaskTemplatesList
            setShowCreateForm={setShowCreateForm} showCreateForm={showCreateForm}
            templates={templates} loadTemplates={loadTemplates}
            handleDeleteTemplate={handleDeleteTemplate}
          />
        </div>
      </main>
    </div>
  );
}
