import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ref, set, push, get, onValue } from 'firebase/database';
import { storage, db } from '@/utils/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Folder, File } from '@/types/firebase';

export function useFolders() {
  const { userId } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);

  // Fetch folders and their files
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const foldersRef = ref(db, `users/${userId}/folders`);
    const unsubscribe = onValue(
      foldersRef,
      (snapshot) => {
        const folderList: Folder[] = [];
        snapshot.forEach((childSnapshot) => {
          const folderData = childSnapshot.val();
          const files = folderData.files || [];
          folderList.push({
            id: childSnapshot.key,
            ...folderData,
            files,
          });
        });
        setFolders(folderList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching folders:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Get all images from all folders
  const getAllImages = (): File[] => {
    return folders.reduce((allImages: File[], folder) => {
      return [...allImages, ...(folder.files || [])];
    }, []);
  };

  // Create a new folder
  const createFolder = async (folderName: string) => {
    setIsCreatingFolder(true);
    try {
      const newFolderRef = push(ref(db, `users/${userId}/folders`));
      await set(newFolderRef, {
        name: folderName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: [],
        userId,
      });
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder. Please try again.');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Upload a file to a specific folder
  const uploadFile = async (folderId: string, file: File) => {
    setIsUploadingFile(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed!');
      }

      const fileRef = storageRef(storage, `user_folders/${userId}/${folderId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      const folderRef = ref(db, `users/${userId}/folders/${folderId}`);
      const folderSnapshot = await get(folderRef);
      const folderData = folderSnapshot.val();

      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        url: fileUrl,
        type: 'image',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folderId,
        userId,
      };

      const updatedFiles = folderData.files ? [...folderData.files, newFile] : [newFile];
      await set(folderRef, {
        ...folderData,
        files: updatedFiles,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Delete a folder
  const deleteFolder = async (folderId: string) => {
    setIsDeletingFolder(true);
    try {
      const folderRef = ref(db, `users/${userId}/folders/${folderId}`);
      await set(folderRef, null); // Delete folder from database
      // Optionally, delete associated files from Firebase Storage
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Failed to delete folder. Please try again.');
    } finally {
      setIsDeletingFolder(false);
    }
  };

  // Get images from a specific folder
  const getFolderImages = async (folderId: string): Promise<File[]> => {
    try {
      const folderRef = ref(db, `users/${userId}/folders/${folderId}`);
      const folderSnapshot = await get(folderRef);
      const folderData = folderSnapshot.val();

      if (folderData && folderData.files) {
        return folderData.files; // Return the array of files (images)
      }
      return []; // Return an empty array if no files exist
    } catch (err) {
      console.error('Error fetching folder images:', err);
      setError('Failed to fetch folder images. Please try again.');
      return [];
    }
  };

  // Generate a shareable link for a folder
  const getFolderShareLink = (folderId: string) => {
    return `${window.location.origin}/shared-folder/${folderId}`;
  };

  return {
    folders,
    loading,
    error,
    isCreatingFolder,
    isUploadingFile,
    isDeletingFolder,
    getAllImages,
    createFolder,
    uploadFile,
    deleteFolder,
    getFolderImages,
    getFolderShareLink,
  };
}