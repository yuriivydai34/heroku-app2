import React from "react";
import { Button, Card, CardBody, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFileContext } from "../context/file-context";

export const FileUploader: React.FC = () => {
  const { uploadFile, loading } = useFileContext();
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // For simplicity, we'll handle one file at a time
    const file = files[0];
    setCurrentFile(file);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        handleUpload(file);
      }
    }, 100);
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file);
      setCurrentFile(null);
      setUploadProgress(0);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="*/*"
      />

      {currentFile ? (
        <Card className="w-full">
          <CardBody className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon
                icon={getFileTypeIcon(currentFile.type)}
                className="text-primary"
                width={24}
                height={24}
              />
              <div className="flex-grow">
                <p className="font-medium">{currentFile.name}</p>
                <p className="text-xs text-default-400">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>
            </div>

            <Progress
              value={uploadProgress}
              color="primary"
              className="mb-2"
              size="sm"
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-default-500">
                {uploadProgress < 100 ? "Uploading..." : "Processing..."}
              </span>
              <span className="text-xs font-medium">{uploadProgress}%</span>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed ${dragActive ? "border-primary bg-primary-50" : "border-default-200"
            } transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardBody className="flex flex-col items-center justify-center p-6">
            <Icon
              icon="lucide:upload-cloud"
              className={`${dragActive ? "text-primary" : "text-default-400"} mb-2`}
              width={40}
              height={40}
            />
            <p className="text-default-600 font-medium mb-1">
              {dragActive ? "Drop file here" : "Drag & drop file here"}
            </p>
            <p className="text-default-400 text-sm mb-4">or click to browse</p>
            <Button
              color="primary"
              variant="flat"
              onPress={handleButtonClick}
              isLoading={loading}
              startContent={!loading && <Icon icon="lucide:upload" />}
            >
              Upload File
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

// Helper function to get appropriate icon based on file type
function getFileTypeIcon(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return "lucide:image";
  } else if (mimetype === "application/pdf") {
    return "lucide:file-text";
  } else if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) {
    return "lucide:file-spreadsheet";
  } else if (mimetype.includes("word") || mimetype.includes("document")) {
    return "lucide:file-text";
  } else if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) {
    return "lucide:file-presentation";
  } else {
    return "lucide:file";
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}