import PostCard from "@/components/cards/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Posts",
  description:
    "Explore the latest posts from tenants in the Estate Care community. Stay updated with important announcements, ask questions, share experiences, and engage with other residents. The 'Posts' section allows tenants to create and manage their posts to connect with the community.",
};

export default function PostPage() {
  return (
    <>
      <PostCard />
    </>
  );
}
