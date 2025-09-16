interface TaskFileUploadProps {
  onFileSelect?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  taskId: string;
}