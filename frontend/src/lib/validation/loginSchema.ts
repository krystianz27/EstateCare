import * as z from "zod";

const ERROR_MESSAGES = {
  email: "Enter a valid email address",
  passwordMin: "Password must be at least 8 characters long",
};

export const loginUserSchema = z.object({
  email: z.string().trim().email({ message: ERROR_MESSAGES.email }),
  password: z.string().trim().min(8, { message: ERROR_MESSAGES.passwordMin }),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
