import { useState } from 'react';
import { storage } from '@/utils/firebase';
import { ref, uploadBytes } from 'firebase/storage';

// Function to upload a file
export const uploadFile = async (file: File) => {
  console.log("Uploading file:", file.name);
  const storageRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(storageRef, file);
  console.log("File uploaded successfully");
};

// Hook for managing storage operations
export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      await uploadFile(file); // Call the uploadFile function
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
} 