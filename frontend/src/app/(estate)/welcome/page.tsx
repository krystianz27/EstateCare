import React from "react";
import type { Metadata, Viewport } from "next";
import { defaultMetadata, viewport } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;
export const viewportMeta: Viewport = viewport;

export default function WelcomePage() {
  return (
    <div>
      <h1 className="dark:text-pumpkin text-6xl">Welcome Page</h1>
    </div>
  );
}
