interface CommentFileUploadProps {
  onFileSelect?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  commentId: string;
}