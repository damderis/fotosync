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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const foldersRef = ref(db, `users/${userId}/folders`);
    const unsubscribe = onValue(foldersRef, (snapshot) => {
      const folderList: Folder[] = [];
      snapshot.forEach((childSnapshot) => {
        folderList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setFolders(folderList);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching folders:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const createFolder = async (folderName: string) => {
    const newFolderRef = push(ref(db, `users/${userId}/folders`));
    await set(newFolderRef, {
      name: folderName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: [],
      userId
    });
  };

  const uploadFile = async (folderId: string, file: File) => {
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
      userId
    };

    const updatedFiles = folderData.files ? [...folderData.files, newFile] : [newFile];
    await set(folderRef, { 
      ...folderData, 
      files: updatedFiles,
      updatedAt: new Date().toISOString()
    });
  };

  const getFolderShareLink = (folderId: string) => {
    return `${window.location.origin}/shared-folder/${folderId}`;
  };

  return {
    folders,
    createFolder,
    uploadFile,
    getFolderShareLink,
    loading,
    error,
  };
} 