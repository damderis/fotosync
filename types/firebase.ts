export interface AvailableSlot {
  id: string
  photographerId: string
  date: string // ISO date format (YYYY-MM-DD)
  startTime: string // HH:mm format (09:00)
  endTime: string // HH:mm format (17:00)
  status: 'available' | 'booked' | 'pending'
  bufferHours: number // Default 2-hour buffer between appointments
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  photographerId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  date: string
  startTime: string
  endTime: string
  duration: number // Add this
  totalPrice: number // Add this
  status: 'upcoming' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt?: string
}

export type User = {
  id: string
  email: string
  name: string
  phone?: string
  bio?: string
  createdAt: string
  updatedAt: string
  avatarUrl?: string
  status: 'active' | 'suspended' | 'inactive'
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

// Other types remain the same as they're not affected by the booking changes
export type Folder = {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export type File = {
  id: string
  folderId: string
  userId: string
  name: string
  url: string
  thumbnailUrl?: string
  type: 'image' | 'video'
  createdAt: string
  updatedAt: string
}

export interface BookingForm {
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  startTime: string
  endTime: string
}

// Removed OpenSlot interface as its functionality is covered by AvailableSlot