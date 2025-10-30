import { Backup, CreateBackupDto, BackupResponseDto, RestoreBackupResponseDto } from "@/types";
import authService from "./auth.service";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const BackupService = {
  // Get all backups
  getAllBackups: async (): Promise<BackupResponseDto[]> => {
    const response = await fetch(`${baseUrl}/backups`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch backups');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  // Get backup by ID
  getBackupById: async (id: number): Promise<BackupResponseDto> => {
    const response = await fetch(`${baseUrl}/backups/${id}`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch backup');
    }

    return await response.json();
  },

  // Create a new backup
  createBackup: async (createBackupDto: CreateBackupDto): Promise<BackupResponseDto> => {
    const response = await fetch(`${baseUrl}/backups`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createBackupDto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create backup');
    }

    return await response.json();
  },

  // Download backup file
  downloadBackup: async (id: number): Promise<void> => {
    const response = await fetch(`${baseUrl}/backups/${id}/download`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to download backup');
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `backup-${id}.sql`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },



  // Delete backup
  deleteBackup: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${baseUrl}/backups/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete backup');
    }

    return await response.json();
  },

  // Restore backup
  restoreBackup: async (id: number): Promise<RestoreBackupResponseDto> => {
    const response = await fetch(`${baseUrl}/backups/${id}/restore`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to restore backup');
    }

    return await response.json();
  },
};

export default BackupService;