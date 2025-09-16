interface UploadResponse {
  success: boolean;
  message?: string;
  data?: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url?: string;
  };
  error?: string;
}