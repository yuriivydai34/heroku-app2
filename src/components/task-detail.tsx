import React from "react";
import { Button, Card, CardBody, Chip, Divider, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Task, UserData } from "../types";
import { format } from "date-fns";
import { CommentProvider } from "../context/comment-context";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { useUserContext } from "../context/user-context";

interface TaskDetailProps {
  task: Task;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const { users } = useUserContext();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Not available";
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const getUserName = (id: number | undefined) => {
    if (typeof id !== "number") return "Unknown";
    const user = users.find(u => u.id === id);
    return user?.UserProfile ? user.UserProfile.name : `User #${id}`;
  };

  const getUserRole = (id: number | undefined) => {
    if (typeof id !== "number") return "Unknown";
    const user = users.find(u => u.id === id);
    return user?.UserProfile ? user.UserProfile.role : "Unknown";
  };

  const getAssociates = () => {
    return task.usersIdAssociate.map(id => {
      const user = users.find(u => u.id === id);
      return user?.UserProfile ? `${user.UserProfile.name} (${user.UserProfile.role})` : `User #${id}`;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <Chip 
            color={task.active ? "success" : "default"} 
            variant="flat"
          >
            {task.active ? "Active" : "Inactive"}
          </Chip>
        </div>
        
        {task.description && (
          <p className="mt-2 text-default-600">{task.description}</p>
        )}
      </div>
      
      <Divider />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-default-500 mb-1">Deadline</h3>
          <p>{formatDate(task.deadline)}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-default-500 mb-1">Created</h3>
          <p>{formatDateTime(task.createdAt)}</p>
        </div>
        
        {task.updatedAt && task.updatedAt !== task.createdAt && (
          <div>
            <h3 className="text-sm font-medium text-default-500 mb-1">Last Updated</h3>
            <p>{formatDateTime(task.updatedAt)}</p>
          </div>
        )}
      </div>
      
      <Divider />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-default-500 mb-1">Creator</h3>
          <p>{getUserName(task.userIdCreator)} ({getUserRole(task.userIdCreator)})</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-default-500 mb-1">Supervisor</h3>
          <p>{getUserName(task.userIdSupervisor)} ({getUserRole(task.userIdSupervisor)})</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-default-500 mb-2">Associates</h3>
        {task.usersIdAssociate.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {task.usersIdAssociate.map((id) => (
              <Chip key={id} variant="flat" size="sm">
                {getUserName(id)}
              </Chip>
            ))}
          </div>
        ) : (
          <p className="text-default-400">No associates assigned</p>
        )}
      </div>
      
      <Divider />
      
      <div>
        <h3 className="text-sm font-medium text-default-500 mb-2">Attached Files</h3>
        {task.files && task.files.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            <div className="mb-2 text-xs text-default-400">
              {task.files.length} file{task.files.length !== 1 ? 's' : ''} attached to this task
            </div>
            {task.files.map((file) => (
              <Card key={file.id} className="w-full border border-default-200 bg-default-50">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-default-100 p-2 rounded-medium">
                      <Icon 
                        icon={getFileIcon(file.mimetype)} 
                        className="text-default-600" 
                        width={24} 
                        height={24} 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{file.originalName}</p>
                      <p className="text-xs text-default-400">
                        {formatFileSize(file.size)} • {file.mimetype.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary"
                      >
                        <Tooltip content="Download file">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                          >
                            <Icon icon="lucide:download" />
                          </Button>
                        </Tooltip>
                      </a>
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary"
                      >
                        <Tooltip content="View file">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                          >
                            <Icon icon="lucide:external-link" />
                          </Button>
                        </Tooltip>
                      </a>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-default-400">No files attached</p>
        )}
      </div>
      
      <Divider />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <CommentProvider>
          <CommentForm taskId={task.id!} userId={task.userIdCreator ?? 0} />
          <CommentList taskId={task.id!} />
        </CommentProvider>
      </div>
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