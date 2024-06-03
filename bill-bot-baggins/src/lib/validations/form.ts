import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email().max(100),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' })
    .max(100),
});
