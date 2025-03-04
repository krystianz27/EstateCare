import type { Metadata, Viewport } from "next";

import { defaultMetadata, viewport as myViewport } from "@/lib/metadata";
import Image from "next/image";
import buildingImage from "@/../public/assets/images/photo13.webp";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = myViewport;

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
