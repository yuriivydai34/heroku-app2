import { UploadedFile } from "../types";
import { v4 as uuidv4 } from "uuid";

// Mock storage for files
let files: UploadedFile[] = [
  {
    id: 1,
    filename: "document-1.pdf",
    originalName: "Project Brief.pdf",
    size: 1024 * 1024 * 2.5, // 2.5 MB
    mimetype: "application/pdf",
    url: "https://example.com/files/document-1.pdf"
  },
  {
    id: 2,
    filename: "image-1.jpg",
    originalName: "Screenshot.jpg",
    size: 1024 * 512, // 512 KB
    mimetype: "image/jpeg",
    url: "https://example.com/files/image-1.jpg"
  }
];

export const FileService = {
  // Get all files
  getAllFiles: (): Promise<UploadedFile[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...files]);
      }, 500);
    });
  },

  // Get file by ID
  getFileById: (id: number): Promise<UploadedFile | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const file = files.find(f => f.id === id);
        resolve(file ? { ...file } : undefined);
      }, 300);
    });
  },

  // Upload a new file
  uploadFile: (file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate file upload
        const fileExtension = file.name.split('.').pop() || '';
        const filename = `file-${uuidv4().slice(0, 8)}.${fileExtension}`;
        
        const newFile: UploadedFile = {
          id: Math.max(0, ...files.map(f => f.id || 0)) + 1,
          filename,
          originalName: file.name,
          size: file.size,
          mimetype: file.type,
          url: `https://example.com/files/${filename}`
        };
        
        files = [...files, newFile];
        resolve({ ...newFile });
      }, 1000); // Simulate upload time
    });
  },

  // Delete a file
  deleteFile: (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = files.findIndex(f => f.id === id);
        if (index === -1) {
          reject(new Error(`File with ID ${id} not found`));
          return;
        }
        
        files = [
          ...files.slice(0, index),
          ...files.slice(index + 1)
        ];
        
        resolve(true);
      }, 500);
    });
  }
};
