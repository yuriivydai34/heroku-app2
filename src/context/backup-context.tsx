import React from "react";
import { Backup, CreateBackupDto, BackupResponseDto, RestoreBackupResponseDto } from "../types";
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
  deleteBackup: (id: number) => Promise<boolean>;
  restoreBackup: (id: number) => Promise<RestoreBackupResponseDto>;
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
  deleteBackup: async () => false,
  restoreBackup: async () => ({} as RestoreBackupResponseDto),
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

  const restoreBackup = React.useCallback(async (id: number): Promise<RestoreBackupResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await BackupService.restoreBackup(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore backup";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
      deleteBackup,
      restoreBackup,
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
      deleteBackup,
      restoreBackup,
      selectBackup,
      clearError,
    ]
  );

  return <BackupContext.Provider value={value}>{children}</BackupContext.Provider>;
};

export default BackupContext;