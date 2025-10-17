import React, { useEffect, useState } from "react";
import { useBackupContext } from "../../context/backup-context";
import { CreateBackupDto } from "../../types";
import { useTranslations } from "next-intl";
import { formatFileSize } from "../../utils/file-utils";

const BackupComponent = () => {
  const {
    backups,
    loading,
    error,
    fetchBackups,
    createBackup,
    downloadBackup,
    uploadToCloud,
    deleteBackup,
    clearError
  } = useBackupContext();

  const t = useTranslations('BackupPage');

  const [formData, setFormData] = useState<CreateBackupDto>({
    name: '',
    description: ''
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await createBackup(formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleDownload = async (id: number) => {
    try {
      await downloadBackup(id);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleUploadToCloud = async (id: number) => {
    try {
      await uploadToCloud(id);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteBackup(id);
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          disabled={loading}
        >
          {t('createBackup')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              {t('closeError')}
            </button>
          </div>
        </div>
      )}

      {/* Create Backup Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{t('createNewBackup')}</h2>
            <form onSubmit={handleCreateBackup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('backupNameRequired')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('enterBackupName')}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('enterBackupDescription')}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {loading ? t('creating') : t('create')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backups List */}
      {loading && backups.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loadingBackups')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {backups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t('noBackupsFound')}</p>
            </div>
          ) : (
            backups.map((backup) => (
              <div
                key={backup.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {backup.name}
                    </h3>
                    {backup.description && (
                      <p className="text-gray-600 mt-1">{backup.description}</p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p>{t('file')}: {backup.filename}</p>
                      <p>{t('size')}: {formatFileSize(backup.size)}</p>
                      <p>{t('created')}: {formatDate(backup.createdAt)}</p>
                      {backup.cloudUrl && (
                        <p className="text-green-600">{t('uploadedToCloud')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleDownload(backup.id)}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      {t('download')}
                    </button>
                    {!backup.cloudUrl && (
                      <button
                        onClick={() => handleUploadToCloud(backup.id)}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {t('uploadToCloud')}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(backup.id)}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BackupComponent;