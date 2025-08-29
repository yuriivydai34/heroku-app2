'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import authService from '../../../services/auth.service';
import taskService from '../../../services/task.service';
import commentService from '../../../services/comment.service';
import { userService } from '@/services/user.service';
import NavHeader from '@/components/NavHeader';
import TaskContent from '@/components/TaskContent';
import CommentsSection from '@/components/CommentsSection';

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  userIdSupervisor: number;
  userIdAssociate: number;
}

interface CommentData {
  id?: string;
  content: string;
  taskId?: number;
  userId?: number;
  createdAt?: string;
}

interface UserData {
  id: string;
  username: string;
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
    userIdCreator: 0,
    userIdAssociate: 0,
    userIdSupervisor: 0
  });

  // Comments state
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (taskId) {
      loadTask();
      loadComments();
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
          userIdCreator: response.data.userIdCreator,
          userIdSupervisor: response.data.userIdSupervisor,
          userIdAssociate: response.data.userIdAssociate,
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

  const loadComments = async () => {
    setCommentsLoading(true);
    setCommentsError(null);

    try {
      const { data } = await commentService.fetchComments(taskId);

      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setCommentsError('Failed to load comments');
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !taskId) {
      setCommentsError('Comment content is required');
      return;
    }

    setIsSubmittingComment(true);
    setCommentsError(null);

    try {
      const response = await commentService.createComment({
        content: newComment.trim(),
        taskId: taskId,
      });

      if (response.success) {
        setNewComment('');
        loadComments(); // Reload comments
      } else {
        setCommentsError(response.message || 'Failed to create comment');
      }
    } catch (err) {
      setCommentsError('An error occurred while creating the comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await commentService.deleteComment(commentId);

      if (response.success) {
        loadComments(); // Reload comments
      } else {
        setCommentsError(response.message || 'Failed to delete comment');
      }
    } catch (err) {
      setCommentsError('An error occurred while deleting the comment');
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
        userIdAssociate: editForm.userIdAssociate,
        userIdCreator: editForm.userIdCreator,
        userIdSupervisor: editForm.userIdSupervisor,
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

  const handleFilesClick = () => {
    router.push(`/task-upload/${taskId}`);
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
      <NavHeader />

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
          <TaskContent 
            task={task} isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            handleUpdateTask={handleUpdateTask} editForm={editForm} 
            setEditForm={setEditForm} users={users}
            handleToggleComplete={handleToggleComplete}
            handleFilesClick={handleFilesClick}
            handleDeleteTask={handleDeleteTask} />

          {/* Comments Section */}
          <CommentsSection 
            comments={comments} users={users} 
            isSubmittingComment={isSubmittingComment}
            commentsLoading={commentsLoading}
            commentsError={commentsError} 
            setCommentsError={setCommentsError}
            newComment={newComment} setNewComment={setNewComment}
            handleSubmitComment={handleSubmitComment}
            loadComments={loadComments}
            handleDeleteComment={handleDeleteComment}
            />
        </div>
      </main>
    </div>
  );
}
