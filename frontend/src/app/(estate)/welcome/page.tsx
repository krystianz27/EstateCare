import React from "react";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;

export default function WelcomePage() {
  return (
    <div>
      <h1 className="dark:text-pumpkin text-6xl">Welcome Page</h1>
    </div>
  );
}
