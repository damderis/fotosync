import { adminDb } from './firebase-admin';
import type { User, Portfolio, Folder, File, AvailableSlot, SessionPrice, Booking } from '@/types/firebase';

export const Collections = {
  users: adminDb.collection('users'),
  portfolios: adminDb.collection('portfolios'),
  folders: adminDb.collection('folders'),
  files: adminDb.collection('files'),
  availableSlots: adminDb.collection('available_slots'),
  sessionPrices: adminDb.collection('session_prices'),
  bookings: adminDb.collection('bookings'),
} as const;

export const getUserData = async (userId: string) => {
  const userDoc = await Collections.users.doc(userId).get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const getPortfolio = async (userId: string) => {
  const portfolioSnapshot = await Collections.portfolios
    .where('userId', '==', userId)
    .limit(1)
    .get();
  
  if (portfolioSnapshot.empty) return null;
  const doc = portfolioSnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Portfolio;
};

export const getFolders = async (userId: string) => {
  const foldersSnapshot = await Collections.folders
    .where('userId', '==', userId)
    .get();
  
  return foldersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Folder[];
};

// Add more utility functions as needed... 