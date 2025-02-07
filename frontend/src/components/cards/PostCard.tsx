"use client";

import { useGetAllPostsQuery } from "@/lib/redux/features/posts/postApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { PostState } from "@/types";
import {
  formatDate,
  formatRepliesCount,
  formatViewCount,
  sortByDateDescending,
} from "@/utils";
import Spinner from "../shared/Spinner";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import { EyeIcon, MessageSquareQuoteIcon } from "lucide-react";
import PaginationSection from "../shared/Pagination";

const formatPostDate = (createdAt: string) => {
  return (
    <div>
      <span>Posted on</span>
      <span className="ml-1 dark:text-pumpkin">{formatDate(createdAt)}</span>
    </div>
  );
};

const formatLastUpdated = (updatedAt: string) => {
  return (
    <div>
      <span>Last Updated</span>
      <span className="ml-1 dark:text-pumpkin">
        {formatDistanceToNow(parseISO(updatedAt), { addSuffix: true })}
      </span>
    </div>
  );
};

export default function PostCard() {
  const page = useAppSelector((state: PostState) => state.post.page);
  const { data, isLoading } = useGetAllPostsQuery({ page });

  const posts = data?.posts.results ?? [];
  const totalCount = data?.posts.count || 0;
  const totalPages = Math.ceil(totalCount / 9);

  const sortedPosts = sortByDateDescending(posts, "created_at");

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="h2-semibold dark:text-lime-500">No Posts Found!</p>;
  }

  return (
    <>
      <Link
        href="/posts/create-post"
        className="flex justify-center max-sm:w-full sm:w-full"
      >
        <Button className="h3-semibold electricIndigo-gradient min-h-[46px] w-full min-w-60 px-4 py-3 text-babyPowder sm:w-auto">
          Create a Post
        </Button>
      </Link>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-robotoSlab text-5xl dark:text-pumpkin">
          All Posts - ({posts.length})
        </h1>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-6">
        {sortedPosts.map((postItem) => {
          const titlePreview =
            postItem.title.length > 25
              ? `${postItem.title.substring(0, 25)}...`
              : postItem.title;

          const bodyPreview =
            postItem.body.length > 65
              ? `${postItem.body.substring(0, 65)}...`
              : postItem.body;

          return (
            <Card
              key={postItem.id}
              className="rounded-3xl border dark:border-gray dark:bg-zinc-900"
            >
              <article className="w-full pb-4 dark:text-platinum">
                <CardHeader>
                  <CardTitle className="font-robotSlab text-center text-2xl">
                    {titlePreview}
                  </CardTitle>
                  <CardDescription>
                    {formatPostDate(postItem.created_at)}
                    {formatLastUpdated(postItem.updated_at)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="border-y border-t-deepBlueGrey py-4 text-sm dark:border-gray">
                  <p className="dark:text-platinum">{bodyPreview}</p>
                </CardContent>

                <div className="flex flex-col items-start gap-2 p-2">
                  <div className="flex-row-center dark:text-platinum">
                    <EyeIcon className="post-icon mr-1 text-electricIndigo" />
                    {formatViewCount(postItem.view_count)}
                  </div>

                  <div className="flex-row-center dark:text-platinum">
                    <MessageSquareQuoteIcon className="post-icon mr-1 text-electricIndigo" />
                    <span>{formatRepliesCount(postItem.replies_count)}</span>
                  </div>

                  <Link
                    href={`/posts/${postItem.slug}`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="sm"
                      className="lime-gradient w-full text-babyPowder sm:w-auto"
                    >
                      View Post
                    </Button>
                  </Link>
                </div>
              </article>
            </Card>
          );
        })}
      </div>
      <PaginationSection totalPages={totalPages} entityType="post" />
    </>
  );
}
