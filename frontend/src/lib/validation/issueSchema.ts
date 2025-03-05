import * as z from "zod";

export const issueCreateSchema = z.object({
  apartmentId: z.string().uuid("You must select a valid apartment"),
  title: z.string().trim().min(1, "An Issue must have a title"),
  description: z.string().min(1, "An Issue must have a description"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["reported", "resolved", "in_progress"]),
});

export type IssueCreateSchema = z.infer<typeof issueCreateSchema>;

export const issueUpdateSchema = z.object({
  status: z.enum(["reported", "resolved", "in_progress"]).optional(),
  assigned_to: z.string().optional(),
});

export type IssueUpdateSchema = z.infer<typeof issueUpdateSchema>;
