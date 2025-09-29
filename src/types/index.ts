export interface Task {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  usersIdAssociate: number[];
  userIdSupervisor: number;
  files?: UploadedFile[];
}

export interface UploadedFile {
  id?: number;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url?: string;
}

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface Comment {
  id?: string;
  taskId: string;
  text: string;
  userId: number;
  createdAt?: string;
  files?: UploadedFile[];
}

export interface Message {
  id: string;
  content: string;
  senderId: number;
  timestamp: string;
  roomId?: string;
  receiverId?: number;
  isRead: boolean;
  files?: UploadedFile[];
}

export interface ChatRoom {
  id: string;
  name: string;
  createdBy: number;
  createdAt: string;
  members: number[];
  isDirectMessage?: boolean;
}

export interface UserStatus {
  userId: number;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export interface ChecklistItem {
  id?: number;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id?: number;
  title: string;
  taskId?: number;

  checklistItems?: ChecklistItem[];
}

export interface TaskChecklistResponse {
  success: boolean;
  data?: Checklist | Checklist[];
  message?: string;
}

export interface TaskSort {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface TaskResponse {
  success: boolean;
  data?: Task[];
  message?: string;
}

export interface UserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any; // Allow for additional profile fields
}

export interface UserData {
  id: string;
  username: string;
  UserProfile?: UserProfileData;
}