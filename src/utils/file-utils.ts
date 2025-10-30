/**
 * Utility function to get the correct file URL
 * If the URL is already absolute (starts with http:// or https://), return it as is
 * Otherwise, prepend the base URL
 */
export const getFileUrl = (fileUrl: string | undefined): string => {
  if (!fileUrl) {
    return '';
  }

  // Check if the URL is already absolute
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // If it's a relative URL, prepend the base URL
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  return `${baseUrl}/${fileUrl}`;
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Get file type from mimetype
 */
export const getFileTypeFromMimetype = (mimetype: string | undefined): string => {
  if (!mimetype || typeof mimetype !== "string" || !mimetype.includes('/')) {
    return "UNKNOWN";
  }
  return mimetype.split('/')[1].toUpperCase();
};