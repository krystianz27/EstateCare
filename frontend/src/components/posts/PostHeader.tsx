import { useTheme } from "next-themes";
import React from "react";
import { CardDescription, CardTitle } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ClockIcon, EyeIcon } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { formatViewCount } from "@/utils";

interface PostHeaderProps {
  title?: string | undefined;
  avatar?: string | undefined;
  author_username: string | undefined;
  created_at: string | undefined;
  view_count: number | undefined;
}

export default function PostHeader({
  title,
  avatar,
  author_username,
  created_at,
  view_count,
}: PostHeaderProps) {
  const { theme } = useTheme();

  return (
    <>
      <CardTitle className="dark:text-platinum">
        <div className="text-center">
          <Avatar>
            <AvatarImage
              src={
                avatar ??
                (theme === "dark"
                  ? "/assets/icons/user-profile-circle.svg"
                  : "/assets/icons/user-profile-light-circle.svg")
              }
              alt="Author Avatar"
              className="size-8 rounded-full border-2 border-electricIndigo dark:border-pumpkin sm:size-10"
            />
          </Avatar>
          <span className="block text-2xl">@{author_username}</span>
        </div>
      </CardTitle>

      <CardDescription className="mt-2">
        <div className="flex items-center space-x-2">
          <ClockIcon className="tab-icon hidden text-electricIndigo sm:block" />
          <span className="text-xl-font-baby">
            <span className="mr-1">Posted</span>
            {created_at
              ? formatDistanceToNow(parseISO(created_at), { addSuffix: true })
              : "No date available"}
          </span>
          <EyeIcon className="tab-icon text-electricIndigo" />
          <span className="text-xl-font-baby">
            {formatViewCount(view_count)}
          </span>
        </div>
      </CardDescription>
    </>
  );
}
