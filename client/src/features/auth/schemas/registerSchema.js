import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name kam se kam 2 characters ka hona chahiye"),
  email: z.string().email("Valid email address daalein"),
  mobileNumber: z.string().regex(/^\d{10,15}$/, "Invalid mobile number format"),
  password: z.string().min(6, "Password kam se kam 6 characters ka ho"),
});