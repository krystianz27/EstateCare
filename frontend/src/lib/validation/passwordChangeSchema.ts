import { z } from "zod";

export const passwordChangeSchema = z
  .object({
    current_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirm_new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "New passwords must match",
    path: ["confirm_new_password"],
  });

export type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;
