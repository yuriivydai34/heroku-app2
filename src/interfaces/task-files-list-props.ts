interface TaskFilesListProps {
  onFileDeleted?: (id: number) => void;
  onRefresh?: () => void;
  className?: string;
  taskId: string;
}