import { z } from "zod";

export const CreateUserRequestSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.string(),
  password: z.string().min(8),
});

export const SearchUserRequestSchema = z.object({
  name: z.string(),
  page: z.coerce.number().optional(),
});

export const UpdateUserRequestSchema = z.object({
  bio: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export const LoginUserRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});
