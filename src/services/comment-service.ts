import { Comment } from "../types";
import { v4 as uuidv4 } from "uuid";

// Mock storage for comments
let comments: Comment[] = [
  {
    id: "1",
    taskId: "1",
    text: "Started working on the documentation structure",
    userId: 1,
    createdAt: "2024-07-02T09:15:00Z",
    files: []
  },
  {
    id: "2",
    taskId: "1",
    text: "Added initial sections for API documentation",
    userId: 3,
    createdAt: "2024-07-03T14:30:00Z",
    files: []
  }
];

export const CommentService = {
  // Get comments by task ID
  getCommentsByTaskId: (taskId: string): Promise<Comment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskComments = comments.filter(c => c.taskId === taskId);
        resolve([...taskComments]);
      }, 300);
    });
  },

  // Create a new comment
  createComment: (comment: Comment): Promise<Comment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment: Comment = {
          ...comment,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          files: comment.files || []
        };
        comments = [...comments, newComment];
        resolve({ ...newComment });
      }, 300);
    });
  },

  // Delete a comment
  deleteComment: (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = comments.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error(`Comment with ID ${id} not found`));
          return;
        }
        
        comments = [
          ...comments.slice(0, index),
          ...comments.slice(index + 1)
        ];
        
        resolve(true);
      }, 300);
    });
  }
};