import React from "react";
import { Backup, CreateBackupDto, BackupResponseDto } from "../types";
import { BackupService } from "../services/backup.service";

interface BackupContextType {
  backups: BackupResponseDto[];
  loading: boolean;
  error: string | null;
  selectedBackup: BackupResponseDto | null;
  fetchBackups: () => Promise<void>;
  createBackup: (createBackupDto: CreateBackupDto) => Promise<BackupResponseDto>;
  getBackupById: (id: number) => Promise<BackupResponseDto>;
  downloadBackup: (id: number) => Promise<void>;
  uploadToCloud: (id: number) => Promise<BackupResponseDto>;
  deleteBackup: (id: number) => Promise<boolean>;
  selectBackup: (backup: BackupResponseDto | null) => void;
  clearError: () => void;
}

const BackupContext = React.createContext<BackupContextType>({
  backups: [],
  loading: false,
  error: null,
  selectedBackup: null,
  fetchBackups: async () => {},
  createBackup: async () => ({} as BackupResponseDto),
  getBackupById: async () => ({} as BackupResponseDto),
  downloadBackup: async () => {},
  uploadToCloud: async () => ({} as BackupResponseDto),
  deleteBackup: async () => false,
  selectBackup: () => {},
  clearError: () => {},
});

export const useBackupContext = () => React.useContext(BackupContext);

export const BackupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backups, setBackups] = React.useState<BackupResponseDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = React.useState<BackupResponseDto | null>(null);

  const fetchBackups = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBackups = await BackupService.getAllBackups();
      setBackups(fetchedBackups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch backups");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBackup = React.useCallback(async (createBackupDto: CreateBackupDto): Promise<BackupResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const newBackup = await BackupService.createBackup(createBackupDto);
      setBackups(prev => [newBackup, ...prev]);
      return newBackup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create backup";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBackupById = React.useCallback(async (id: number): Promise<BackupResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const backup = await BackupService.getBackupById(id);
      setSelectedBackup(backup);
      return backup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch backup";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadBackup = React.useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await BackupService.downloadBackup(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to download backup";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadToCloud = React.useCallback(async (id: number): Promise<BackupResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const updatedBackup = await BackupService.uploadToCloud(id);
      setBackups(prev => prev.map(backup => 
        backup.id === id ? updatedBackup : backup
      ));
      if (selectedBackup?.id === id) {
        setSelectedBackup(updatedBackup);
      }
      return updatedBackup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload backup to cloud";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedBackup?.id]);

  const deleteBackup = React.useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await BackupService.deleteBackup(id);
      setBackups(prev => prev.filter(backup => backup.id !== id));
      if (selectedBackup?.id === id) {
        setSelectedBackup(null);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete backup";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedBackup?.id]);

  const selectBackup = React.useCallback((backup: BackupResponseDto | null) => {
    setSelectedBackup(backup);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const value = React.useMemo(
    () => ({
      backups,
      loading,
      error,
      selectedBackup,
      fetchBackups,
      createBackup,
      getBackupById,
      downloadBackup,
      uploadToCloud,
      deleteBackup,
      selectBackup,
      clearError,
    }),
    [
      backups,
      loading,
      error,
      selectedBackup,
      fetchBackups,
      createBackup,
      getBackupById,
      downloadBackup,
      uploadToCloud,
      deleteBackup,
      selectBackup,
      clearError,
    ]
  );

  return <BackupContext.Provider value={value}>{children}</BackupContext.Provider>;
};

export default BackupContext;