"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useGetMyPostsQuery } from "@/lib/redux/features/posts/postApiSlice";
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
import PaginationLocal from "../shared/PaginationLocal";
import {
  formatDate,
  formatRepliesCount,
  formatViewCount,
  sortByDateDescending,
} from "@/utils";

const formatPostDate = (createdAt: string) => {
  return (
    <div>
      <span>Posted on</span>
      <span className="dark:text-pumpkin ml-1">{formatDate(createdAt)}</span>
    </div>
  );
};

const formatLastUpdated = (updatedAt: string) => {
  return (
    <div>
      <span>Last Updated</span>
      <span className="dark:text-pumpkin ml-1">
        {formatDistanceToNow(parseISO(updatedAt), { addSuffix: true })}
      </span>
    </div>
  );
};

export default function PostCard() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useGetMyPostsQuery({ page: currentPage });

  const totalPosts = data?.my_posts.count || 0;
  const posts = data?.my_posts.results ?? [];
  const totalPages = Math.ceil(totalPosts / 10);

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
        <Button className="h3-semibold electricIndigo-gradient text-babyPowder mt-4 min-h-[46px] w-full min-w-60 px-4 py-3 sm:w-auto">
          Create a Post
        </Button>
      </Link>
      <div className="mt-6 flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-robotoSlab dark:text-pumpkin text-5xl">
          All Posts - ({totalPosts})
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
              className="dark:border-gray rounded-3xl border bg-zinc-50 dark:bg-zinc-900"
            >
              <article className="dark:text-platinum w-full pb-4">
                <CardHeader>
                  <CardTitle className="font-robotSlab text-center text-2xl">
                    {titlePreview}
                  </CardTitle>
                  <CardDescription>
                    {formatPostDate(postItem.created_at)}
                    {formatLastUpdated(postItem.updated_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="border-t-deepBlueGrey dark:border-gray border-y py-4 text-sm">
                  <p className="dark:text-platinum">{bodyPreview}</p>
                </CardContent>
                <div className="flex flex-col items-start gap-2 p-2">
                  <div className="flex-row-center dark:text-platinum">
                    <EyeIcon className="post-icon text-electricIndigo mr-1" />
                    {formatViewCount(postItem.view_count)}
                  </div>
                  <div className="flex-row-center dark:text-platinum">
                    <MessageSquareQuoteIcon className="post-icon text-electricIndigo mr-1" />
                    <span>{formatRepliesCount(postItem.replies_count)}</span>
                  </div>
                  <Link
                    href={`/posts/${postItem.slug}`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="sm"
                      className="lime-gradient text-babyPowder w-full sm:w-auto"
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
      <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}
