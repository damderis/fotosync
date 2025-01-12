import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app } from '@/utils/firebase';

export function useFirebaseAuth() {
  const { getToken } = useAuth();
  const auth = getAuth(app);

  useEffect(() => {
    const signInWithClerk = async () => {
      try {
        const token = await getToken({ template: 'integration_firebase' });
        if (token) {
          await signInWithCustomToken(auth, token);
        }
      } catch (error) {
        console.error('Error signing in with Firebase:', error);
      }
    };

    signInWithClerk();
  }, [getToken, auth]);

  return auth;
} 