"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MyDocuments from "./MyDocuments";
import SharedDocuments from "./SharedDocuments";

export default function DocumentList() {
  const [tab, setTab] = useState("my-documents");
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setTab(value);
    const type = value === "my-documents" ? "owned" : "shared";
    router.push(`?page=1&type=${type}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Link href="/documents/create">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full rounded-lg bg-zinc-800 text-white sm:w-64">
            Add New Document
          </Button>
        </Link>
      </div>

      <Tabs
        className="dark:border-eerieBlack space-y-6 rounded-lg border pb-4"
        defaultValue="my-documents"
        value={tab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6 grid min-h-20 w-full grid-cols-1 gap-6 rounded-lg bg-neutral-900 px-4 py-3 max-sm:min-h-40 sm:grid-cols-2">
          <TabsTrigger
            value="my-documents"
            className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
          >
            My Documents
          </TabsTrigger>
          <TabsTrigger
            value="shared-documents"
            className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
          >
            Shared Documents
          </TabsTrigger>
        </TabsList>
        <div className="my-20 p-4">
          <TabsContent value="my-documents">
            <MyDocuments />
          </TabsContent>
          <TabsContent value="shared-documents">
            <SharedDocuments />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
