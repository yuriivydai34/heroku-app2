'use client';

import FilesList from "@/components/FilesList";
import FileUpload from "@/components/FileUpload";
import authService from "@/services/auth.service";
import { useParams, useRouter } from "next/navigation";

export default function UploadForTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
              <button
                onClick={() => router.push(`/tasks/${taskId}`)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Task
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <h1>Upload Files for Task {taskId}</h1>
      {/* Upload form goes here */}

      {/* FileUpload Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            File Upload
          </h3>
          <FileUpload taskId={taskId} />
        </div>
      </div>

      {/* FilesList Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Files List
          </h3>
          <FilesList taskId={taskId} />
        </div>
      </div>
    </div>
  );
}
