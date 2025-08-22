'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import authService from '../../../services/auth.service';
import taskService from '../../../services/task.service';

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userIdAssignee: number;
}

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState<TaskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    userIdAssignee: 0,
  });

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    if (taskId) {
      loadTask();
    }
  }, [router, taskId]);

  const loadTask = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await taskService.fetchTask(taskId);
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        setTask(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description || '',
          userIdAssignee: response.data.userIdAssignee,
        });
      } else {
        setError(response.message || 'Failed to load task');
      }
    } catch (err) {
      setError('An error occurred while loading the task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task?.id) return;
    
    try {
      const response = await taskService.updateTask(task.id, {
        completed: !task.completed
      });

      if (response.success) {
        loadTask(); // Reload task
      } else {
        setError(response.message || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating the task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task?.id || !editForm.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const response = await taskService.updateTask(task.id, {
        title: editForm.title,
        description: editForm.description,
        userIdAssignee: editForm.userIdAssignee,
      });

      if (response.success) {
        setIsEditing(false);
        loadTask(); // Reload task
        setError(null);
      } else {
        setError(response.message || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating the task');
    }
  };

  const handleDeleteTask = async () => {
    if (!task?.id || !confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await taskService.deleteTask(task.id);

      if (response.success) {
        router.push('/tasks');
      } else {
        setError(response.message || 'Failed to delete task');
      }
    } catch (err) {
      setError('An error occurred while deleting the task');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
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

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/tasks')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
              <button
                onClick={() => router.push('/tasks')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Tasks
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Task'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Task Content */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleUpdateTask} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                      Assignee ID
                    </label>
                    <input
                      type="number"
                      id="assignee"
                      value={editForm.userIdAssignee}
                      onChange={(e) => setEditForm({ ...editForm, userIdAssignee: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Update Task
                    </button>
                  </div>
                </form>
              ) : (
                /* Task Display */
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className={`text-2xl font-bold ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h2>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={handleToggleComplete}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-600">Mark as completed</label>
                    </div>
                  </div>

                  {task.description && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Assignee ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{task.userIdAssignee}</dd>
                      </div>
                      {task.createdAt && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Created</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(task.createdAt).toLocaleString()}
                          </dd>
                        </div>
                      )}
                      {task.updatedAt && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(task.updatedAt).toLocaleString()}
                          </dd>
                        </div>
                      )}
                      {task.id && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Task ID</dt>
                          <dd className="mt-1 text-sm text-gray-900">{task.id}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="border-t pt-6 flex justify-end">
                    <button
                      onClick={handleDeleteTask}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
