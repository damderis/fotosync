export interface OpenSlot {
  id: string
  userId: string
  date: string // ISO string format
  time: string
  status: 'available' | 'booked' | 'expired'
  createdAt: number // timestamp
}

export interface Booking {
  id: string
  slotId: string
  userId: string // photographer's ID
  clientId: string // client's ID (optional for walk-in)
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  date: string // ISO string format
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: number
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

export type Portfolio = {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  services: string[];
  email?: string;
  phone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  status: 'draft' | 'published' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type Folder = {
  id: string;
  userId: string;
  name: string;
  description?: string;
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

export type AvailableSlot = {
  id: string;
  userId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  service: string;
  status: 'available' | 'booked' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export type SessionPrice = {
  id: string;
  userId: string;
  service: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

