'use client';

import FilesList from "@/components/FilesList";
import FileUpload from "@/components/FileUpload";
import NavHeader from "@/components/NavHeader";
import { authService } from "@/services/auth.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadForTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    // Check authentication status
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NavHeader />

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
