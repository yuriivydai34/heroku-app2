import React from "react";
import { Comment } from "../types";
import { CommentService } from "../services/comment-service";

interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchCommentsByTaskId: (taskId: string) => Promise<void>;
  createComment: (comment: Comment) => Promise<Comment>;
  deleteComment: (id: string) => Promise<boolean>;
}

const CommentContext = React.createContext<CommentContextType>({
  comments: [],
  loading: false,
  error: null,
  fetchCommentsByTaskId: async () => {},
  createComment: async () => ({} as Comment),
  deleteComment: async () => false
});

export const useCommentContext = () => React.useContext(CommentContext);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCommentsByTaskId = React.useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedComments = await CommentService.getCommentsByTaskId(taskId);
      setComments(fetchedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, []);

  const createComment = React.useCallback(async (comment: Comment) => {
    setLoading(true);
    setError(null);
    try {
      const newComment = await CommentService.createComment(comment);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create comment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await CommentService.deleteComment(id);
      if (success) {
        setComments(prev => prev.filter(c => c.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    comments,
    loading,
    error,
    fetchCommentsByTaskId,
    createComment,
    deleteComment
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};