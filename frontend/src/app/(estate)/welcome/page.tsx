import React from "react";
import type { Metadata, Viewport } from "next";
import { defaultMetadata, viewport } from "@/lib/metadata";
import Image from "next/image";
import buildingImage from "@/../public/assets/images/photo13.webp";

export const metadata: Metadata = defaultMetadata;
export const viewportMeta: Viewport = viewport;

export default function WelcomePage() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src={buildingImage}
          alt="Apartments"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
    </div>
  );
}
