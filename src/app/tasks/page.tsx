'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import taskService from '../../services/task.service';
import userService from '../../services/user.service';
import NavHeader from '@/components/NavHeader';
import CreateTaskForm from '@/components/CreateTaskForm';
import moment from 'moment';
import 'moment/locale/uk'; // Import the Ukrainian locale
import TasksList from '@/components/TasksList';
import ErrorMessage from '@/components/ErrorMessage';
import { taskTemplateService } from '@/services/taskTemplate.service';
import { Button } from '@heroui/react';

interface UserData {
  id: string;
  username: string;
}

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  usersIdAssociate: number[];
  userIdSupervisor: number;
}

interface TaskTemplateData {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
}

moment.locale('uk');

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
  const [newTask, setNewTask] = useState<TaskData>({
    title: '',
    description: '',
    deadline: '',
    userIdCreator: 0,
    usersIdAssociate: [],
    userIdSupervisor: 0,
    active: true
  });
  const [templates, setTemplates] = useState<TaskTemplateData[]>([]);

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadTasks();
    loadTemplates();
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    const deadlineValue = newTask.deadline
      ? moment(newTask.deadline).isValid()
        ? moment(newTask.deadline).format('YYYY-MM-DDTHH:mm:ss[Z]')
        : undefined
      : undefined;

    try {
      const response = await taskService.createTask({
        title: newTask.title,
        description: newTask.description,
        deadline: deadlineValue,
        userIdCreator: newTask.userIdCreator || 0,
        usersIdAssociate: newTask.usersIdAssociate || [],
        userIdSupervisor: newTask.userIdSupervisor || 0,
      });

      if (response.success) {
        setNewTask({ title: '', description: '', userIdCreator: 0, usersIdAssociate: [], userIdSupervisor: 0 });
        setShowCreateForm(false);
        loadTasks(); // Reload tasks
      } else {
        setError(response.message || 'Failed to create task');
      }
    } catch (err) {
      setError('An error occurred while creating the task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Ви впевнені що хочете видалити?')) {
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
      <NavHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} setError={setError} />
          )}

          {/* Create Task Form */}
          {showCreateForm && (
            <div className="mb-6 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {showCreateForm ? 'Скасувати' : 'Нова задача'}
                </Button>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Нова задача
                </h3>
                <CreateTaskForm
                  handleCreateTask={handleCreateTask} newTask={newTask}
                  setNewTask={setNewTask} users={users} setShowCreateForm={setShowCreateForm}
                  templates={templates}
                /></div>
            </div>
          )}

          {/* Tasks List */}
          <TasksList
            setShowCreateForm={setShowCreateForm} showCreateForm={showCreateForm}
            tasks={tasks} loadTasks={loadTasks}
            handleDeleteTask={handleDeleteTask} users={users}
          />
        </div>
      </main>
    </div>
  );
}
