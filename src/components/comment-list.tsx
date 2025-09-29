import React from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Spinner,
  Chip,
  Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { Comment } from "../types";
import { useCommentContext } from "../context/comment-context";
import { useUserContext } from "@/context/user-context";

interface CommentListProps {
  taskId: string;
}

export const CommentList: React.FC<CommentListProps> = ({ taskId }) => {
  const { comments, loading, error, fetchCommentsByTaskId, deleteComment } = useCommentContext();
  const { users } = useUserContext();

  React.useEffect(() => {
    fetchCommentsByTaskId(taskId);
  }, [taskId, fetchCommentsByTaskId]);

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const getUserInfo = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return {
      name: user ? user.UserProfile?.name : `User #${userId}`,
      role: user ? user.UserProfile?.role : "Unknown"
    };
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  if (loading && comments.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-danger-50 text-danger rounded-medium">
        Error: {error}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center p-8 bg-default-50 rounded-medium">
        <Icon icon="lucide:message-circle" className="mx-auto mb-2 text-default-400" width={32} height={32} />
        <p className="text-default-600">No comments yet</p>
        <p className="text-default-400 text-sm">Be the first to add a comment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const user = getUserInfo(comment.userId);

        return (
          <Card key={comment.id} className="w-full">
            <CardBody className="p-4">
              <div className="flex gap-3">
                <Avatar
                  name={user.name}
                  src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${comment.userId}`}
                  className="flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-default-400">{user.role} • {formatDateTime(comment.createdAt)}</p>
                    </div>
                    <Tooltip content="Delete comment" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(comment.id!)}
                      >
                        <Icon icon="lucide:trash-2" size={16} />
                      </Button>
                    </Tooltip>
                  </div>

                  <p className="mt-2">{comment.text}</p>

                  {comment.files && comment.files.length > 0 && (
                    <div className="mt-3">
                      <Divider className="my-2" />
                      <p className="text-xs text-default-500 mb-2">Attached Files:</p>
                      <div className="space-y-2">
                        {comment.files.map((file) => (
                          <div key={file.id} className="flex items-center gap-2 bg-default-50 p-2 rounded-medium">
                            <Icon
                              icon={getFileIcon(file.mimetype)}
                              className="text-default-600"
                              width={16}
                              height={16}
                            />
                            <span className="text-xs flex-grow truncate" title={file.originalName}>
                              {file.originalName}
                            </span>
                            <span className="text-xs text-default-400">
                              {formatFileSize(file.size)}
                            </span>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary"
                            >
                              <Icon icon="lucide:external-link" size={14} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

// Helper function to get appropriate icon based on file type
function getFileIcon(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return "lucide:image";
  } else if (mimetype === "application/pdf") {
    return "lucide:file-text";
  } else if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) {
    return "lucide:file-spreadsheet";
  } else if (mimetype.includes("word") || mimetype.includes("document")) {
    return "lucide:file-text";
  } else if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) {
    return "lucide:file-presentation";
  } else {
    return "lucide:file";
  }
}