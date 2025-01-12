import {
  useGetSinglePostQuery,
  useReplyToPostMutation,
} from "@/lib/redux/features/posts/postApiSlice";
import { replyCreateSchema, ReplyCreateSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { useEffect } from "react";

interface ReplyFormProps {
  slug: string | undefined;
  postId?: string;
}

export default function ReplyCreateForm({ slug }: ReplyFormProps) {
  const {
    data,
    isLoading: isQueryLoading,
    error,
  } = useGetSinglePostQuery(slug ?? "", { skip: !slug });
  const postId = data?.post?.id;

  const [replyToPost, { isLoading }] = useReplyToPostMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyCreateSchema>({
    resolver: zodResolver(replyCreateSchema),
    mode: "all",
    defaultValues: {
      body: "",
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load post data.");
    }
  }, [error]);

  if (isQueryLoading) {
    return <Spinner size="lg" />;
  }

  const onSubmit = async (values: ReplyCreateSchema) => {
    if (!postId) {
      toast.error("Unable to find the post to reply to.");
      return;
    }

    try {
      await replyToPost({ postId, ...values }).unwrap();
      toast.success("Your reply was created.");
      router.push(`/posts/${slug}`);
      reset();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || "An error occurred");
    }
  };
  return (
    <main>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <FormFieldComponent
          name="body"
          register={register}
          errors={errors}
          placeholder="Add your reply"
          isTextArea
          className="font-semibold"
        />
        {errors.body && <p className="text-red-500">{errors.body.message}</p>}

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Add your reply"}
        </Button>
      </form>
    </main>
  );
}
