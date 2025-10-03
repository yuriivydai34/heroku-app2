import { UploadedFile } from "../types";
import { authService } from "./auth.service";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const FileService = {
  // Get all files
  getAllFiles: async (): Promise<UploadedFile[]> => {
    const response = await fetch(`${baseUrl}/file-upload`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    return response.json();
  },

  // Get file by ID
  getFileById: async (id: number): Promise<UploadedFile | undefined> => {
    const response = await fetch(`${baseUrl}/file-upload/${id}`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }
    return response.json();
  },

  // Upload a new file
  uploadFile: async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(`${baseUrl}/file-upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const result = await response.json();
    return result.data;
  },

  // Delete a file
  deleteFile: async (id: number): Promise<boolean> => {
    const response = await fetch(`${baseUrl}/file-upload/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    return response.json();
  },
};
