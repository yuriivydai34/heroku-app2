'use client';

import BackupComponent from '@/components/admin/Backup';
import { BackupProvider } from '@/context/backup-context';
import AdminGuard from "@/components/AdminGuard";

const BackupPage = () => {
  return (
    <AdminGuard>
      <BackupProvider>
        <div className="min-h-screen bg-background">
          <BackupComponent />
        </div>
      </BackupProvider>
    </AdminGuard>
  );
};
export default BackupPage;