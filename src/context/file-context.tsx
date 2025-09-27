import React from "react";
import { UploadedFile } from "../types";
import { FileService } from "../services/file-service";

interface FileContextType {
  files: UploadedFile[];
  loading: boolean;
  error: string | null;
  selectedFiles: UploadedFile[];
  fetchFiles: () => Promise<void>;
  uploadFile: (file: File) => Promise<UploadedFile>;
  deleteFile: (id: number) => Promise<boolean>;
  toggleFileSelection: (file: UploadedFile) => void;
  clearSelectedFiles: () => void;
  setSelectedFiles: (files: UploadedFile[]) => void;
}

const FileContext = React.createContext<FileContextType>({
  files: [],
  loading: false,
  error: null,
  selectedFiles: [],
  fetchFiles: async () => {},
  uploadFile: async () => ({} as UploadedFile),
  deleteFile: async () => false,
  toggleFileSelection: () => {},
  clearSelectedFiles: () => {},
  setSelectedFiles: () => {}
});

export const useFileContext = () => React.useContext(FileContext);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<UploadedFile[]>([]);

  const fetchFiles = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedFiles = await FileService.getAllFiles();
      setFiles(fetchedFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = React.useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const newFile = await FileService.uploadFile(file);
      setFiles(prev => [...prev, newFile]);
      return newFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = React.useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await FileService.deleteFile(id);
      if (success) {
        setFiles(prev => prev.filter(f => f.id !== id));
        setSelectedFiles(prev => prev.filter(f => f.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFileSelection = React.useCallback((file: UploadedFile) => {
    setSelectedFiles(prev => {
      const isSelected = prev.some(f => f.id === file.id);
      if (isSelected) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  }, []);

  const clearSelectedFiles = React.useCallback(() => {
    setSelectedFiles([]);
  }, []);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const value = {
    files,
    loading,
    error,
    selectedFiles,
    fetchFiles,
    uploadFile,
    deleteFile,
    toggleFileSelection,
    clearSelectedFiles,
    setSelectedFiles
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};
