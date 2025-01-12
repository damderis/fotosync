import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { Folder } from '@/types/firebase';

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

    const q = query(
      collection(db, 'folders'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setFolders(
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder))
        );
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching folders:', err);
        setError(err.message);
        setFolders([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { folders, loading, error };
} 