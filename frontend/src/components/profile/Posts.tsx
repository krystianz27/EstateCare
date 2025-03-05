"use client";

import { TabsContent } from "@/components/ui/tabs";
import PostCard from "../cards/PostCard";

export default function Posts() {
  return (
    <TabsContent value="posts">
      <PostCard />
    </TabsContent>
  );
}
