import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface TagProps {
  tags: string[];
}

export default function TagList({ tags }: TagProps) {
  return (
    <div className="flex justify-between gap-2">
      {tags.map((tag, index) => (
        <Link
          key={index}
          href={`/tags/${tag}`}
          className="mt-3.5 rounded-md bg-electricIndigo px-4 py-2 text-sm uppercase text-babyPowder"
        >
          <Badge>{tag}</Badge>
        </Link>
      ))}
    </div>
  );
}
