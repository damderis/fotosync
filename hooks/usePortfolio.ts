import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { Portfolio } from '@/types/firebase';

export function usePortfolio() {
  const { userId } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'portfolios'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPortfolio({ id: doc.id, ...doc.data() } as Portfolio);
          setError(null);
        } else {
          setPortfolio(null);
          setError('Portfolio not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching portfolio:', err);
        setError(err.message);
        setPortfolio(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { portfolio, loading, error };
} 