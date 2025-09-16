import authService from './auth.service';

class TaskFileUploadService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  }

  async uploadMultipleFiles(
    files: File[],
    taskId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    onFileComplete?: (fileIndex: number, result: UploadResponse) => void
  ): Promise<UploadResponse[]> {
    const results: UploadResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const result = await this.uploadFile(file, taskId, (progress) => {
        if (onProgress) {
          onProgress(i, progress);
        }
      });

      results.push(result);

      if (onFileComplete) {
        onFileComplete(i, result);
      }
    }

    return results;
  }

  async uploadFile(
    file: File, 
    taskId: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers: Record<string, string> = {};

      // Add auth headers if user is authenticated
      if (authService.isAuthenticated()) {
        const token = authService.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${this.baseUrl}/task-upload/${taskId}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async deleteFile(id: number): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/task-upload/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Delete failed');
      }

      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  async getUploadedFiles(taskId: string): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/task-upload/${taskId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch files');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Files retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch files',
      };
    }
  }

  validateFile(file: File, maxSize: number = 10, acceptedTypes: string[] = []): string | null {
    // Check file size (maxSize in MB)
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type if acceptedTypes is provided
    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('/')) {
          const [category, subtype] = type.split('/');
          const [fileCategory] = file.type.split('/');
          return subtype === '*' ? fileCategory === category : file.type === type;
        }
        return false;
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export a singleton instance
export const taskFileUploadService = new TaskFileUploadService();
export default taskFileUploadService;
