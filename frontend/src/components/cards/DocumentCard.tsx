"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    created_at: string;
    file_url: string;
  };
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const handleDownload = () => {
    const fileUrl = document.file_url.startsWith("/")
      ? `${process.env.NEXT_PUBLIC_DOMAIN}${document.file_url}`
      : document.file_url;

    const link = window.document.createElement("a");
    link.href = fileUrl;
    link.download = document.title;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    console.log(fileUrl);
  };

  // const handleDownload = () => {
  //   const fileUrl = document.file_url.startsWith("/")
  //     ? `${process.env.NEXT_PUBLIC_API_URL}${document.file_url}`
  //     : document.file_url;

  //   window.open(fileUrl, "_blank");
  // };

  return (
    <Card className="rounded-lg border border-gray-300 p-4 shadow-sm hover:shadow-lg">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{document.title}</h3>
        <p className="text-xs text-gray-400">
          Created on {format(new Date(document.created_at), "dd MMM yyyy")}
        </p>
        <div className="mt-4 flex justify-between gap-2">
          <Link href={`/documents/${document.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
