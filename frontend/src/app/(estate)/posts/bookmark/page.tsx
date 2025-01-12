import PostsBookmarkedCard from "@/components/cards/PostsBookmarkedCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Bookmarked Posts",
  description:
    "View and manage all the posts you have bookmarked in Estate Care. Stay organized and keep track of your favorite content.",
};

export default function BookmarkedPostsPage() {
  return (
    <>
      <PostsBookmarkedCard />
    </>
  );
}
