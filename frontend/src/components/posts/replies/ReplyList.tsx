import { Reply } from "@/types";
import { useTheme } from "next-themes";
import React from "react";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";

interface ReplyProps {
  reply: Reply;
}

export default function RepliesList({ reply }: ReplyProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarImage
          src={
            reply.avatar ??
            (theme === "dark"
              ? "/assets/icons/user-profile-circle.svg"
              : "/assets/icons/user-profile-light-circle.svg")
          }
          alt="Author Avatar"
          className="rounded-full border-2 border-electricIndigo dark:border-pumpkin"
          width={35}
          height={35}
        />
      </Avatar>
      <div>
        <p className="flex items-center space-x-2">
          <span className="font-semibold dark:text-platinum">
            @{reply.author_username}
          </span>
          <span className="text-lg text-electricIndigo dark:text-lime-500">
            {formatDistanceToNow(parseISO(reply.created_at), {
              addSuffix: true,
            })}
          </span>
        </p>
        <p className="text-lg dark:text-platinum">{reply.body}</p>
      </div>
    </div>
  );
}
