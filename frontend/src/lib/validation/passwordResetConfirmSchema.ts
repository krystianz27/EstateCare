import * as z from "zod";

const ERROR_MESSAGES = {
  passwordMin: "Password must be at least 8 characters long",
  confirmPasswordMin: "Confirm Password must be at least 8 characters long",
  passwordMismatch: "Passwords do not match",
};

export const passwordResetConfirmSchema = z
  .object({
    uid: z.string().trim(),
    token: z.string().trim(),
    new_password: z.string().min(8, { message: ERROR_MESSAGES.passwordMin }),
    re_new_password: z.string().min(8, {
      message: ERROR_MESSAGES.confirmPasswordMin,
    }),
  })
  .refine((data) => data.new_password === data.re_new_password, {
    message: ERROR_MESSAGES.passwordMismatch,
    path: ["re_new_password"],
  });

export type PasswordResetConfirmSchema = z.infer<
  typeof passwordResetConfirmSchema
>;
