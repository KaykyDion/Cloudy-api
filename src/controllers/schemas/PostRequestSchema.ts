import { z } from "zod";

export const SearchPostRequestSchema = z.object({
  text: z.string().optional(),
  page: z.coerce.number().optional(),
});

export const CreatePostRequestSchema = z.object({
  content: z.string(),
});
