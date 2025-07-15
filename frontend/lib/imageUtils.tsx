/**
 * imageUtils.js
 *
 * Utility functions for image validation and conversion.
 * Used by BookForm and other components for client-side image handling.
 *
 * @module imageUtils
 */

/**
 * Check if a file is a valid image (JPEG, PNG, GIF, WebP) and under 5MB.
 * @param {File} file
 * @returns {boolean}
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
}

/**
 * Convert a File to a data URL.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target as FileReader)?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const imageUtils = { isValidImageFile, fileToDataURL };
