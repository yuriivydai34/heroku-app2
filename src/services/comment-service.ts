import { Comment } from "../types";
import authService from "./auth.service";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const CommentService = {
  // Get comments by task ID
  getCommentsByTaskId: async (taskId: string): Promise<Comment[]> => {
    const response = await fetch(`${baseUrl}/comments/find-by-task/${taskId}`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    return response.json();
  },

  // Create a new comment
  createComment: async (comment: Comment): Promise<Comment> => {
    const fileIds = comment.files?.map(file => file.id) || [];
    const response = await fetch(`${baseUrl}/comments`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ ...comment, files: fileIds }),
    });
    if (!response.ok) {
      throw new Error("Failed to create comment");
    }
    const newComment = await response.json();
    return newComment;
  },

  // Delete a comment
  deleteComment: async (id: string): Promise<boolean> => {
    const response = await fetch(`${baseUrl}/comments/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
    return true;
  }
};