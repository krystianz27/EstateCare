import * as z from "zod";

const ERROR_MESSAGES = {
  username:
    "Usernames can only contain letters (uppercase and lowercase), digits, _, @, +, ., and -",
  firstNameMin: "First name must be at least 2 characters long",
  firstNameMax: "First name must be less than 50 characters long",
  lastNameMin: "Last name must be at least 2 characters long",
  lastNameMax: "Last name must be less than 50 characters long",
  email: "Enter a valid email address",
  passwordMin: "Password must be at least 8 characters long",
  confirmPasswordMin: "Confirm Password must be at least 8 characters long",
  passwordMismatch: "Passwords do not match",
};

const usernameRegex = /^[a-zA-Z0-9_@+.-]+$/;

export const registerUserSchema = z
  .object({
    username: z.string().regex(usernameRegex, {
      message: ERROR_MESSAGES.username,
    }),
    first_name: z
      .string()
      .trim()
      .min(2, { message: ERROR_MESSAGES.firstNameMin })
      .max(50, { message: ERROR_MESSAGES.firstNameMax }),
    last_name: z
      .string()
      .trim()
      .min(2, { message: ERROR_MESSAGES.lastNameMin })
      .max(50, { message: ERROR_MESSAGES.lastNameMax }),
    email: z.string().trim().email({ message: ERROR_MESSAGES.email }),
    password: z.string().min(8, { message: ERROR_MESSAGES.passwordMin }),
    re_password: z.string().min(8, {
      message: ERROR_MESSAGES.confirmPasswordMin,
    }),
  })
  .refine((data) => data.password === data.re_password, {
    message: ERROR_MESSAGES.passwordMismatch,
    path: ["re_password"],
  });

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
