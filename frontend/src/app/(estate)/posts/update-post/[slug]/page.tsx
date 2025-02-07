import { AuthFormHeader } from "@/components/forms/auth";
import PostUpdateForm from "@/components/forms/posts/PostUpdateForm";
import React from "react";

// interface UpdateParamsProps {
//   params: {
//     slug: string;
//   };
// }

interface UpdateParamsProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UpdatePostPage({ params }: UpdateParamsProps) {
  const resolvedParams = await params;

  return (
    <div>
      <AuthFormHeader
        title="Update Post"
        staticText="Want to go back?"
        linkText="Back to Posts"
        linkHref="/welcome"
      />
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="rounded-xl bg-lightGrey px-6 py-12 shadow dark:bg-deepBlueGrey sm:rounded-lg sm:px-12 md:rounded-3xl">
          <PostUpdateForm params={resolvedParams} />
        </div>
      </div>
    </div>
  );
}
