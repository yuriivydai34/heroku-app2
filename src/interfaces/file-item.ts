interface FileItem {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url?: string;
  uploadDate?: string;
}