"use client";

import { useGetAllMyBookmarksQuery } from "@/lib/redux/features/posts/postApiSlice";
import {
  formatDate,
  formatRepliesCount,
  formatViewCount,
  sortByDateDescending,
} from "@/utils";
import Spinner from "../shared/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon, MessageSquareQuoteIcon } from "lucide-react";

export default function PostsBookmarkedCard() {
  const { data, isLoading } = useGetAllMyBookmarksQuery();
  const bookmarks = data?.bookmarked_posts;

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }
  if (!bookmarks || bookmarks.results.length === 0) {
    return (
      <div>
        <h1 className="flex-center mb-3.5 font-robotoSlab text-5xl dark:text-pumpkin">
          My Bookmarks - (0)
        </h1>
        <p className="h2-semibold dark:text-lime-500">
          No Bookmarks added Yet!
        </p>
      </div>
    );
  }

  const sortedBookmarks = sortByDateDescending(
    bookmarks?.results ?? [],
    "created_at",
  );

  return (
    <div>
      <h1 className="flex-center mb-3.5 font-robotoSlab text-5xl dark:text-pumpkin">
        My Bookmarks - ({bookmarks.results.length})
      </h1>

      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <div className="mt-4 grid grid-cols-2 gap-6">
          {sortedBookmarks.map((bookmarkItem) => (
            <Card
              key={bookmarkItem.id}
              className="rounded-lg border dark:border-gray"
            >
              <CardHeader className="w-full pb-4 dark:text-platinum">
                <CardTitle className="text-center font-robotoSlab text-2xl">
                  {bookmarkItem.title.length > 30
                    ? `${bookmarkItem.title.substring(0, 30)}....`
                    : bookmarkItem.title}
                </CardTitle>

                <CardDescription>
                  <div className="flex flex-row justify-between">
                    <div>
                      <span>Posted on</span>
                      <span className="ml-1 dark:text-pumpkin">
                        {formatDate(bookmarkItem.created_at).toString()}
                      </span>
                    </div>
                    <div>
                      <span>Last Updated</span>
                      <span className="ml-1 dark:text-pumpkin">
                        {formatDistanceToNow(
                          parseISO(bookmarkItem.updated_at),
                          {
                            addSuffix: true,
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="border-y border-t-deepBlueGrey py-4 text-sm dark:border-gray">
                <p className="dark:text-platinum">
                  {bookmarkItem.body.length > 65
                    ? `${bookmarkItem.body.substring(0, 65)}....`
                    : bookmarkItem.body}
                </p>
              </CardContent>

              <div className="flex flex-row items-center justify-between p-2">
                <div>
                  <Link href={`/posts/${bookmarkItem.slug}`}>
                    <Button size="sm" className="lime-gradient text-babyPowder">
                      View Post
                    </Button>
                  </Link>
                </div>

                <div className="flex-row-center dark:text-platinum">
                  <EyeIcon className="post-icon mr-1 text-electricIndigo" />
                  {formatViewCount(bookmarkItem.view_count)}
                </div>

                <div className="flex-row-center dark:text-platinum">
                  <MessageSquareQuoteIcon className="post-icon mr-1 text-electricIndigo" />
                  <span>{formatRepliesCount(bookmarkItem.replies.length)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
