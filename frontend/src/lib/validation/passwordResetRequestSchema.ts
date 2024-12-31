import * as z from "zod";

const ERROR_MESSAGES = {
  email: "Enter a valid email address",
};

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: ERROR_MESSAGES.email })
    .toLowerCase(),
});

export type PasswordResetRequestSchema = z.infer<
  typeof passwordResetRequestSchema
>;
