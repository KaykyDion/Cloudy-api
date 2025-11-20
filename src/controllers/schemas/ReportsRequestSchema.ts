import { z } from "zod";

export const CreateReportRequestSchema = z.object({
  text: z.string(),
});

export const GetReportsQuerySchema = z.object({
  userId: z.string().optional(),
});
