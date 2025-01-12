import PostTagCard from "@/components/cards/PostTagCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Post Tags",
  description:
    "View posts categorized by tags. Discover posts tagged with specific topics.",
};

interface SlugParamsProps {
  params: {
    tagSlug: string;
  };
}

export default async function PostTagPage({ params }: SlugParamsProps) {
  const resolvedParams = await params;

  return (
    <>
      <PostTagCard params={resolvedParams} />
    </>
  );
}
