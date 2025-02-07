"use client";

import { useGetPostsByTagQuery } from "@/lib/redux/features/posts/postApiSlice";
import Spinner from "../shared/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate, formatRepliesCount, formatViewCount } from "@/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon, MessageSquareQuoteIcon } from "lucide-react";

interface SlugParamsProps {
  params: {
    tagSlug: string;
  };
}

export default function PostTagCard({ params }: SlugParamsProps) {
  const { data, isLoading } = useGetPostsByTagQuery(params.tagSlug);

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  const posts = data?.posts_by_tag.results || [];

  if (posts.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl dark:text-pumpkin">
          No posts available for this tag.
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="flex-center font-robotoSlab text-4xl dark:text-pumpkin">
        Posts tagged with{" "}
        <span className="ml-1 text-electricIndigo dark:text-lime-500">
          &ldquo;{params.tagSlug}&rdquo;
        </span>
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-lg border dark:border-gray">
            <CardHeader className="w-full pb-4 dark:text-platinum">
              <CardTitle className="text-center font-robotoSlab text-2xl">
                {post.title.length > 30
                  ? `${post.title.slice(0, 30)}....`
                  : post.title}
              </CardTitle>

              <CardDescription>
                <div className="flex flex-row justify-between">
                  <div>
                    <span>Posted on</span>
                    <span className="ml-1 dark:text-pumpkin">
                      {formatDate(post.created_at).toString()}
                    </span>
                  </div>
                  <div>
                    <span>Last Updated</span>
                    <span className="ml-1 dark:text-pumpkin">
                      {formatDistanceToNow(parseISO(post.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent className="border-y border-t-deepBlueGrey py-4 text-sm dark:border-gray">
              <p className="dark:text-platinum">
                {post.body.length > 65
                  ? `${post.body.substring(0, 65)}....`
                  : post.body}
              </p>
            </CardContent>

            <div className="flex flex-row items-center justify-between p-2">
              <div>
                <Link href={`/posts/${post.slug}`}>
                  <Button size="sm" className="lime-gradient text-babyPowder">
                    View Post
                  </Button>
                </Link>
              </div>

              <div className="flex-row-center dark:text-platinum">
                <EyeIcon className="post-icon mr-1 text-electricIndigo" />
                {formatViewCount(post.view_count)}
              </div>

              <div className="flex-row-center dark:text-platinum">
                <MessageSquareQuoteIcon className="post-icon mr-1 text-electricIndigo" />
                <span>{formatRepliesCount(post.replies_count)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
