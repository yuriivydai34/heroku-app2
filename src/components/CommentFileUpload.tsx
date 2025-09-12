'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import commentFileUploadService from '../services/commentFileUpload.service';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  commentId: string;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  progress?: number;
  uploadedData?: any;
}

export default function FileUpload({
  onFileSelect,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  className = '',
  commentId,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): string | null => {
    return commentFileUploadService.validateFile(file, maxSize, acceptedTypes);
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    const currentFileCount = files.length;

    for (let i = 0; i < Math.min(fileList.length, maxFiles - currentFileCount); i++) {
      const file = fileList[i];
      const error = validateFile(file);

      const uploadedFile: UploadedFile = {
        file,
        id: generateId(),
        error: error || undefined,
      };

      // Create preview for images
      if (file.type.startsWith('image/') && !error) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, preview: e.target?.result as string }
              : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    if (onFileSelect) {
      const validFiles = updatedFiles
        .filter(f => !f.error)
        .map(f => f.file);
      onFileSelect(validFiles);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);

    if (onFileSelect) {
      const validFiles = updatedFiles
        .filter(f => !f.error)
        .map(f => f.file);
      onFileSelect(validFiles);
    }
  };

  const uploadFiles = async () => {
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      if (fileItem.error || fileItem.uploaded) continue;

      // Set uploading state
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, uploading: true, progress: 0 } : f
      ));

      try {
        const result = await commentFileUploadService.uploadFile(
          fileItem.file,
          commentId,
          (progress) => {
            // Update progress
            setFiles(prev => prev.map(f =>
              f.id === fileItem.id ? { ...f, progress: progress.percentage } : f
            ));
          }
        );

        if (result.success) {
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id
              ? {
                ...f,
                uploading: false,
                uploaded: true,
                progress: 100,
                uploadedData: result.data
              }
              : f
          ));
        } else {
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id
              ? {
                ...f,
                uploading: false,
                error: result.error || 'Upload failed',
                progress: 0
              }
              : f
          ));
        }
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id
            ? {
              ...f,
              uploading: false,
              error: error instanceof Error ? error.message : 'Upload failed',
              progress: 0
            }
            : f
        ));
      }
    }

    setUploading(false);
  };

  const clearAll = () => {
    setFiles([]);
    if (onFileSelect) {
      onFileSelect([]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    return commentFileUploadService.formatFileSize(bytes);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              Додайте файли сюди
            </p>
            <p className="text-sm text-gray-500 mt-1">
              До {maxFiles} файлів, максимум {maxSize}MB кожен
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Формат:{acceptedTypes.join(', ')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Обрати файли
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Файли ({files.length}/{maxFiles})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Очистити
            </button>
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-4 p-4 bg-white border rounded-lg shadow-sm"
            >
              {/* File Preview */}
              <div className="flex-shrink-0">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.file.size)}
                </p>
                {file.error && (
                  <p className="text-sm text-red-600">{file.error}</p>
                )}
                {file.uploading && file.progress !== undefined && (
                  <div className="mt-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{file.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {file.uploaded && file.uploadedData && (
                  <p className="text-xs text-green-600 mt-1">
                    Завантажено успішно
                    {file.uploadedData.url && (
                      <a
                        href={file.uploadedData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 underline"
                      >
                        View
                      </a>
                    )}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex-shrink-0 flex items-center space-x-2">
                {file.uploading && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {file.uploaded && (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                )}
                {!file.error && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Upload Button */}
          {files.some(f => !f.error && !f.uploaded) && (
            <div className="flex justify-center">
              <button
                onClick={uploadFiles}
                disabled={uploading}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
              >
                {uploading ? 'Uploading...' : 'Завантажити файли'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
