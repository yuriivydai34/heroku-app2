'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import taskService from '../../services/task.service';
import userService from '../../services/user.service';

interface UserData {
  id: string;
  username: string;
}

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  userIdAssociate: number;
  userIdSupervisor: number;
}

export default function TasksPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  // Load users for supervisor/associate selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersArr = await userService.getUsers({});
        if (Array.isArray(usersArr)) {
          setUsers(usersArr);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchUsers();
  }, []);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    userIdCreator: 0,
    userIdAssociate: 0,
    userIdSupervisor: 0
  });

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await taskService.fetchTasks();
      
      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Failed to load tasks');
      }
    } catch (err) {
      setError('An error occurred while loading tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const response = await taskService.createTask({
        title: newTask.title,
        description: newTask.description,
        userIdCreator: newTask.userIdCreator || 0,
        userIdAssociate: newTask.userIdAssociate || 0,
        userIdSupervisor: newTask.userIdSupervisor || 0,
      });

      if (response.success) {
        setNewTask({ title: '', description: '', userIdCreator: 0, userIdAssociate: 0, userIdSupervisor: 0 });
        setShowCreateForm(false);
        loadTasks(); // Reload tasks
      } else {
        setError(response.message || 'Failed to create task');
      }
    } catch (err) {
      setError('An error occurred while creating the task');
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      const response = await taskService.updateTask(taskId, {
        completed: !currentStatus
      });

      if (response.success) {
        loadTasks(); // Reload tasks
      } else {
        setError(response.message || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating the task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await taskService.deleteTask(taskId);

      if (response.success) {
        loadTasks(); // Reload tasks
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
          <p className="mt-4 text-gray-600">Loading tasks...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Dashboard
              </button>
                  </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'New Task'}
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

          {/* Create Task Form */}
          {showCreateForm && (
            <div className="mb-6 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Create New Task
                </h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter task title"
                      style={{ color: 'black' }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter task description"
                      style={{ color: 'black' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
                      Supervisor
                    </label>
                    <select
                      id="supervisor"
                      value={newTask.userIdSupervisor}
                      onChange={(e) => setNewTask({ ...newTask, userIdSupervisor: Number(e.target.value) })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: 'black' }}
                    >
                      <option value={0}>Select supervisor</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} (ID: {user.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="associate" className="block text-sm font-medium text-gray-700">
                      Associate
                    </label>
                    <select
                      id="associate"
                      value={newTask.userIdAssociate}
                      onChange={(e) => setNewTask({ ...newTask, userIdAssociate: Number(e.target.value) })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: 'black' }}
                    >
                      <option value={0}>Select associate</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} (ID: {user.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Tasks ({tasks.length})
                </h3>
                <button
                  onClick={loadTasks}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  🔄 Refresh
                </button>
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks found.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Create your first task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`border rounded-lg p-4 ${
                        task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() => handleToggleComplete(task.id!, task.completed || false)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <button
                              onClick={() => router.push(`/tasks/${task.id}`)}
                              className={`font-medium text-left hover:underline ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900 hover:text-blue-600'
                              }`}
                            >
                              {task.title}
                            </button>
                            {task.description && (
                              <p className={`mt-1 text-sm ${
                                task.completed ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {task.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              {task.createdAt && (
                                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                              )}
                              {task.userIdCreator && (
                                <span>
                                  Created by: {users.find(u => String(u.id) === String(task.userIdCreator))?.username || task.userIdCreator}
                                </span>
                              )}
                              {task.userIdAssociate && (
                                <span>
                                  Assigned to: {users.find(u => String(u.id) === String(task.userIdAssociate))?.username || task.userIdAssociate}
                                </span>
                              )}
                              {task.userIdSupervisor && (
                                <span>
                                  Supervised by: {users.find(u => String(u.id) === String(task.userIdSupervisor))?.username || task.userIdSupervisor}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id!)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                          title="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
