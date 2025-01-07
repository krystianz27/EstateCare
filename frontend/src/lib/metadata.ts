import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width", // Dopasowanie szerokości do urządzenia
  initialScale: 1.0, // Początkowa skala
  maximumScale: 3.0, // Umożliwienie powiększania do 3x
  userScalable: true, // Pozwolenie na skalowanie przez użytkownika
  viewportFit: "cover", // Dopasowanie na urządzeniach z notchem
  themeColor: "#ffffff", // Kolor tła paska tytułu
};

export const defaultMetadata: Metadata = {
  title: "Estate Care | Your Tenant Portal",
  description:
    "Discover Estate Care, the premier platform designed to simplify apartment living. As a tenant, you can create your personal profile, report maintenance issues, share community updates, and connect with other tenants. Our goal is to foster a transparent, interactive, and supportive community.",
  keywords: [
    "Estate Care",
    "tenant portal",
    "apartment management",
    "report issues",
    "tenant communication",
    "community updates",
    "property management",
    "maintenance requests",
    "apartment living",
    "rental community",
  ],
  authors: [
    {
      name: "Estate Care Team",
      //   url: "https://www.estatecare.com",
    },
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Estate Care | Your Tenant Portal",
    description:
      "Discover Estate Care Apartments, the all-in-one platform for tenants to manage their profiles, report issues, and interact with the community.",
    // url: "https://estatecare.example.com",
    images: [
      {
        url: "https://estatecare.example.com/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Estate Care - Tenant Portal",
      },
    ],
  },
};
