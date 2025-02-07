import { MessageCircleMoreIcon } from "lucide-react";
import TagList from "../shared/TagList";
import { CardFooter } from "../ui/card";
import { formatRepliesCount } from "@/utils";

interface PostFooterProps {
  tags: string[] | undefined;
  replies_count: number | undefined;
}

export default function PostFooter({ tags, replies_count }: PostFooterProps) {
  return (
    <CardFooter className="flex items-center justify-between border-b border-dashed border-b-eerieBlack dark:text-platinum">
      <TagList tags={tags ?? []} />
      {/* <div className="flex items-center">
        <MessageCircleMoreIcon className="tab-icon text-electricIndigo" />
        <p className="ml-2">{formatRepliesCount(replies_count)}</p>
      </div> */}
    </CardFooter>
  );
}
