import { z } from 'zod';

export const portfolioSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "About me is required"),
  services: z.array(z.string()),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  instagramUrl: z.string().url().optional(),
  facebookUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  pricePerHour: z.number().min(0, "Price per hour must be a positive number"),
  status: z.enum(['draft', 'published', 'suspended']),
  createdAt: z.string(),
  updatedAt: z.string(),
}); 