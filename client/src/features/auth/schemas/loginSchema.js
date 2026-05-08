import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Valid email address daalein"),
  password: z.string().min(6, "Password kam se kam 6 characters ka ho"),
});