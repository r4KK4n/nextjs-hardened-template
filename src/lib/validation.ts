import { z } from 'zod';

/**
 * Example validation schemas using Zod
 */

export const emailSchema = z.string().email();

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: emailSchema,
  age: z.number().int().min(0).max(120).optional(),
});

export type User = z.infer<typeof userSchema>;

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validateUser = (data: unknown): User | null => {
  const result = userSchema.safeParse(data);
  return result.success ? result.data : null;
};
