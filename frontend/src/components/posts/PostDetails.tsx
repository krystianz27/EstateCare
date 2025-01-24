"use client";

import {
  useBookmarkPostMutation,
  useDownvotePostMutation,
  useGetSinglePostQuery,
  useUpvotePostMutation,
} from "@/lib/redux/features/posts/postApiSlice";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AuthFormHeader } from "../forms/auth";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import ProtectedRoute from "../shared/ProtectedRoutes";
import { formatRepliesCount, sortByDateDescending } from "@/utils";
import { MessageCircleMoreIcon } from "lucide-react";
import ReplyList from "./replies/ReplyList";
import ReplyCreateForm from "../forms/posts/ReplyCreateForm";
import { useEffect, useState } from "react";

interface PostDetailsProps {
  params: {
    slug: string;
  };
}

function PostDetailsContent({ params }: PostDetailsProps) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    if (params.slug) {
      setSlug(params.slug);
    }
  }, [params.slug]);

  console.log(slug);

  const { data } = useGetSinglePostQuery(slug ?? "", { skip: !slug });

  const post = data?.post;
  console.log(post?.title);

  const [upvotePost, { isLoading: isUpvoteLoading }] = useUpvotePostMutation();

  const [downvotePost, { isLoading: isDownvoteLoading }] =
    useDownvotePostMutation();

  const [bookmarkPost, { isLoading: isBookmarkLoading }] =
    useBookmarkPostMutation();

  const sortedReplies = sortByDateDescending(post?.replies ?? [], "created_at");

  const handleUpvote = () => {
    if (post?.id) {
      upvotePost(post.id);
      toast.success("Post Upvoted 😋");
    }
  };

  const handleDownVote = () => {
    if (post?.id) {
      downvotePost(post.id);
      toast.success("Post Downvoted 🥺");
    }
  };

  const handleBookmarkPost = () => {
    if (post?.slug) {
      bookmarkPost(post.slug);
      toast.success("This post has been added to your Bookmarks");
    }
  };

  return (
    <Card className="dark:border-gray rounded-3xl border border-dashed dark:bg-zinc-900">
      <AuthFormHeader linkText="Go back to Home" linkHref="/welcome" />

      <h1 className="text-baby_richBlack font-robotoSlab dark:text-pumpkin text- mt-3 text-center text-3xl">
        {post?.title}
      </h1>

      <CardHeader className="flex-start border-b-eerieBlack dark:border-gray w-full flex-col border-b border-dashed">
        <div className="flex w-full flex-col justify-between sm:flex-row sm:items-center sm:gap-2">
          <PostHeader
            title={post?.title}
            avatar={post?.avatar}
            author_username={post?.author_username}
            created_at={post?.created_at}
            view_count={post?.view_count}
          />

          <PostActions
            upvotes={post?.upvotes}
            downvotes={post?.downvotes}
            handleUpvote={handleUpvote}
            handleDownVote={handleDownVote}
            handleBookmarkPost={handleBookmarkPost}
            isUpvoteLoading={isUpvoteLoading}
            isDownvoteLoading={isDownvoteLoading}
            isBookmarkLoading={isBookmarkLoading}
          />
        </div>
      </CardHeader>

      <PostBody body={post?.body} slug={post?.slug} />

      <PostFooter tags={post?.tags} replies_count={post?.replies_count} />

      <div className="border-b-eerieBlack dark:border-gray dark:text-platinum ml-4 space-y-4 border-b border-dashed py-4">
        <span className="font-robotoSlab dark:text-pumpkin flex flex-row items-center text-lg font-semibold">
          <MessageCircleMoreIcon className="tab-icon text-electricIndigo mr-2" />
          {formatRepliesCount(post?.replies_count)}
        </span>

        {sortedReplies && sortedReplies.length > 0 ? (
          sortedReplies.map((reply) => (
            <ReplyList key={reply.id} reply={reply} />
          ))
        ) : (
          <p className="text-lg">This Post does not have any replies yet</p>
        )}
      </div>

      <CardContent className="border-b-eerieBlack dark:border-gray dark:text-platinum w-full border-b border-dashed">
        <h2 className="h2-semibold dark:text-pumpkin mt-3">
          Add your reply here
        </h2>
        <ReplyCreateForm slug={post?.slug} />
      </CardContent>
    </Card>
  );
}

export default function PostDetails({ params }: PostDetailsProps) {
  return (
    <ProtectedRoute>
      <PostDetailsContent params={params} />
    </ProtectedRoute>
  );
}
