"use client";

import {
  useGetSinglePostQuery,
  useUpdatePostMutation,
} from "@/lib/redux/features/posts/postApiSlice";
import { postUpdateSchema, PostUpdateSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Spinner = dynamic(() => import("@/components/shared/Spinner"));

interface PostUpdateFormProps {
  params: {
    slug: string;
  };
}

export default function PostUpdateForm({ params }: PostUpdateFormProps) {
  const postSlug = params.slug;

  const {
    data,
    isError,
    isLoading: isQueryLoading,
  } = useGetSinglePostQuery(postSlug);
  const post = data?.post;
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostUpdateSchema>({
    resolver: zodResolver(postUpdateSchema),
  });

  useEffect(() => {
    if (post) {
      reset(post);
    }
  }, [post, reset]);

  const onSubmit = async (formValues: PostUpdateSchema) => {
    try {
      await updatePost({ postSlug, ...formValues }).unwrap();
      toast.success("Post updated successfully");
      router.push(`/posts/${postSlug}`);
    } catch (error) {
      toast.error(extractErrorMessage(error) || "Failed to update post");
    }
  };

  if (isQueryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load the post data.</p>;
  }

  return (
    <main>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 dark:text-black"
      >
        <FormFieldComponent
          label="Title"
          name="title"
          register={register}
          errors={errors}
          startIcon={<Text className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="Content"
          name="body"
          register={register}
          errors={errors}
          isTextArea
        />

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Update Post"}
        </Button>
      </form>
    </main>
  );
}
