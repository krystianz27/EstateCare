import * as z from "zod";

export const technicianRatingCreateSchema = z.object({
  rated_user_username: z.string().trim(),
  rating: z
    .number()
    .nonnegative({ message: "Rating cannot be a negative value" })
    .min(1, { message: "Rating must be between 1 and 5" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  comment: z
    .string()
    .min(1, { message: "Please provide a comment to support your rating" }),
});

export type TechnicianRatingCreateSchema = z.infer<
  typeof technicianRatingCreateSchema
>;
