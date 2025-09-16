interface CommentFilesListProps {
  onFileDeleted?: (id: number) => void;
  onRefresh?: () => void;
  className?: string;
  commentId: string;
}