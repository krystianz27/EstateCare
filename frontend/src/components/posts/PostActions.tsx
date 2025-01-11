import React from "react";
import { CardDescription } from "../ui/card";
import Tooltip from "../shared/Tooltip";
import { BookMarkedIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

interface PostActionsProps {
  upvotes: number | undefined;
  downvotes: number | undefined;
  handleUpvote: () => void;
  handleDownVote: () => void;
  handleBookmarkPost: () => void;
  isUpvoteLoading: boolean;
  isDownvoteLoading: boolean;
  isBookmarkLoading: boolean;
}

const buttonClass = "tab-icon text-electricIndigo hidden sm:block";

export default function PostActions({
  upvotes,
  downvotes,
  handleUpvote,
  handleDownVote,
  handleBookmarkPost,
  isUpvoteLoading,
  isBookmarkLoading,
  isDownvoteLoading,
}: PostActionsProps) {
  return (
    <CardDescription className="mt-2">
      <div className="flex items-center space-x-2">
        <Tooltip content="Like this post" position="right">
          <button onClick={handleUpvote} disabled={isUpvoteLoading}>
            <ThumbsUpIcon className={buttonClass} />
          </button>
        </Tooltip>
        <span className="text-xl-font-baby">{upvotes}</span>
        <Tooltip content="Dislike this post">
          <button onClick={handleDownVote} disabled={isDownvoteLoading}>
            <ThumbsDownIcon className={buttonClass} />
          </button>
        </Tooltip>
        <span className="text-xl-font-baby">{downvotes}</span>
        <Tooltip content="Bookmark this post">
          <button onClick={handleBookmarkPost} disabled={isBookmarkLoading}>
            <BookMarkedIcon className={buttonClass} />
          </button>
        </Tooltip>
      </div>
    </CardDescription>
  );
}
