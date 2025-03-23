import * as z from "zod";

export const issueCreateSchema = z.object({
  apartmentId: z.string().uuid("You must select a valid apartment"),
  title: z.string().trim().min(1, "An Issue must have a title"),
  description: z.string().min(1, "An Issue must have a description"),
  priority: z.enum(["low", "medium", "high"]),
});

export type IssueCreateSchema = z.infer<typeof issueCreateSchema>;

export const issueCreateWithApartmentSchema = z.object({
  title: z.string().trim().min(1, "An Issue must have a title"),
  description: z.string().min(1, "An Issue must have a description"),
  priority: z.enum(["low", "medium", "high"]),
});

export type IssueCreateWithApartmentSchema = z.infer<
  typeof issueCreateWithApartmentSchema
>;

export const issueUpdateSchema = z.object({
  status: z.enum(["reported", "resolved", "in_progress"]).optional(),
  assigned_to: z.string().optional(),
  estimated_repair_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  repair_duration: z
    .number()
    .nonnegative({ message: "Rating cannot be a negative value" })
    .min(1, { message: "Rating must be between 1 and 5" })
    .optional(),
});

export type IssueUpdateSchema = z.infer<typeof issueUpdateSchema>;
