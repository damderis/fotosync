import { useState, useEffect } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from '@/utils/firebase';
import type { Portfolio } from '@/types/firebase';

export function usePortfolio(userId: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to portfolio changes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const portfolioRef = ref(db, `portfolios/${userId}`);
    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPortfolio({
            id: snapshot.key!,
            ...data,
            services: Array.isArray(data.services) ? data.services : []
          } as Portfolio);
        } else {
          setPortfolio(null);
        }
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching portfolio:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Create or update portfolio
  const createOrUpdatePortfolio = async (portfolioData: Portfolio) => {
    if (!userId) return;

    try {
      const portfolioRef = ref(db, `portfolios/${userId}`);
      await set(portfolioRef, {
        ...portfolioData,
        services: Array.isArray(portfolioData.services) ? portfolioData.services : [],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw error;
    }
  };

  // Publish portfolio
  const publishPortfolio = async () => {
    if (!portfolio || !userId) return;

    try {
      const portfolioRef = ref(db, `portfolios/${userId}`);
      await set(portfolioRef, {
        ...portfolio,
        status: 'published',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      throw error;
    }
  };

  // Suspend portfolio
  const suspendPortfolio = async () => {
    if (!portfolio || !userId) return;

    try {
      const portfolioRef = ref(db, `portfolios/${userId}`);
      await set(portfolioRef, {
        ...portfolio,
        status: 'suspended',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error suspending portfolio:', error);
      throw error;
    }
  };

  return {
    portfolio,
    loading,
    error,
    createOrUpdatePortfolio,
    publishPortfolio,
    suspendPortfolio
  };
} 