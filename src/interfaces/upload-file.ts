interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  progress?: number;
  uploadedData?: any;
}