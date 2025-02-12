import * as z from "zod";

const fileValidation = z
  .instanceof(File)
  .refine((file) => file.size > 0, {
    message: "File is required.",
  })
  .refine(
    (file) =>
      file.type.startsWith("application/") || file.type.startsWith("image/"),
    {
      message: "Only document or image files are allowed.",
    },
  );

export const documentCreateSchema = z.object({
  title: z.string().trim().min(1, "Document must have a title"),
  file: fileValidation,
  apartment_uuid: z
    .string()
    .uuid("You must select a valid apartment")
    .optional(),
  shared_with: z.array(z.string().uuid("Invalid user ID")).optional(),
});

export type DocumentCreateSchema = z.infer<typeof documentCreateSchema>;

export const documentUpdateSchema = z.object({
  title: z.string().trim().min(1, "Document must have a title").optional(),
  file: z
    .instanceof(File)
    .refine((file) => file instanceof File, {
      message: "A valid file must be provided",
    })
    .optional(),
  shared_with: z.array(z.string().uuid("Invalid user ID")).optional(),
});

export type DocumentUpdateSchema = z.infer<typeof documentUpdateSchema>;

export const documentDeleteSchema = z.object({
  id: z.string().uuid("Invalid document ID"),
});

export type DocumentDeleteSchema = z.infer<typeof documentDeleteSchema>;

export const documentShareSchema = z.object({
  id: z.string().uuid("Invalid document ID"),
  shared_with: z
    .array(z.string().uuid("Invalid user ID"))
    .min(1, "At least one user must be selected"),
});

export type DocumentShareSchema = z.infer<typeof documentShareSchema>;

export const documentRevokeShareSchema = z.object({
  id: z.string().uuid("Invalid document ID"),
  shared_with: z
    .array(z.string().uuid("Invalid user ID"))
    .min(1, "At least one user must be selected"),
});

export type DocumentRevokeShareSchema = z.infer<
  typeof documentRevokeShareSchema
>;
