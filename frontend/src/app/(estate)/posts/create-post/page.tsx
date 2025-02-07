import PostCreateForm from "@/components/forms/posts/PostCreateForm";
import { AuthFormHeader } from "@/components/forms/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Create a Post",
  description:
    "Authenticated users can create posts to share content, ask questions, or provide information for others to view and engage with.",
};

export default function AddPostPage() {
  return (
    <div>
      <AuthFormHeader
        title="Create a Post"
        staticText="Share your thoughts, ask questions, or provide valuable insights with the community!"
        linkText="Return to Home"
        linkHref="/welcome"
      />

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="rounded-xl bg-lightGrey px-6 py-12 shadow dark:bg-deepBlueGrey sm:rounded-lg sm:px-12 md:rounded-3xl">
          <PostCreateForm />
        </div>
      </div>
    </div>
  );
}
