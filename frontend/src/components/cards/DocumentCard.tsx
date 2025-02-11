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
  };
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="rounded-lg border border-gray-300 p-4 shadow-sm hover:shadow-lg">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{document.title}</h3>
        <p className="text-xs text-gray-400">
          Created on {format(new Date(document.created_at), "dd MMM yyyy")}
        </p>
        <div className="mt-4 flex justify-between">
          <Link href={`/documents/${document.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
