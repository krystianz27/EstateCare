import * as z from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1, {
    message: "The title of the post is required and cannot be empty",
  }),
  tags: z
    .array(z.string())
    .min(1, { message: "Please provide at least one tag for the post" }),
  body: z.string().min(1, {
    message: "The body of the post is required and cannot be empty",
  }),
});

export type PostSchema = z.infer<typeof postSchema>;

export const postUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "The title is required and cannot be empty" }),
  body: z.string().min(1, { message: "Please add some content to the post" }),
});

export type PostUpdateSchema = z.infer<typeof postUpdateSchema>;

export const replySchema = z.object({
  body: z.string().min(1, { message: "Please provide a reply message" }),
});

export type ReplySchema = z.infer<typeof replySchema>;
