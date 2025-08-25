'use client';

import { useParams } from "next/navigation";

export default function UploadForTaskPage() {
      const params = useParams();
      const taskId = params.taskId as string;

  return (
    <div>
      <h1>Upload Files for Task {taskId}</h1>
      {/* Upload form goes here */}
    </div>
  );
}
