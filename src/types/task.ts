export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}
