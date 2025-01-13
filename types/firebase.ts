export interface OpenSlot {
  id: string
  userId: string
  date: string // ISO string format
  status: 'available' | 'booked' | 'expired'
  createdAt: number // timestamp
}

export interface Booking {
  id: string;
  userId: string; // photographer's ID
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string; // ISO string format
  startTime: string;
  hours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'inactive';
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  bio: string;
  services: string[];
  email?: string;
  phone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  pricePerHour: number;
  status: 'draft' | 'published' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type Folder = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type File = {
  id: string;
  folderId: string;
  userId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlot {
  id: string;
  userId: string;
  dates: string[]; // Array of ISO date strings
  status: 'available' | 'booked' | 'blocked';
  createdAt: string;
  updatedAt: string;
}


