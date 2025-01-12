import { redirect } from "next/navigation";

import PostDetails from "@/components/posts/PostDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Post Detail",
  description:
    "View the details of a post, including votes, replies, and more.",
};

interface ParamsProps {
  params: {
    slug: string;
  };
}

export default async function PostDetailPage({ params }: ParamsProps) {
  const { slug } = params;
  if (slug === "bookmark") {
    redirect("/bookmark");
  }

  const resolvedParams = await params;
  return (
    <>
      <PostDetails params={resolvedParams} />
    </>
  );
}
