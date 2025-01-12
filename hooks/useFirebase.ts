import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { User } from '@/types/firebase';

export function useUserData() {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          setUserData({ id: doc.id, ...doc.data() } as User);
          setError(null);
        } else {
          setUserData(null);
          setError('User not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user data:', err);
        setError(err.message);
        setUserData(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { userData, loading, error };
} 