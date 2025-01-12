import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { SessionPrice } from '@/types/firebase';

export function useSessionPrices() {
  const { userId } = useAuth();
  const [prices, setPrices] = useState<SessionPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'session_prices'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPrices(
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SessionPrice))
        );
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching prices:', err);
        setError(err.message);
        setPrices([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { prices, loading, error };
} 