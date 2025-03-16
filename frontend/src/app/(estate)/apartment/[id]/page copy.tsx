import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

import ApartmentDetailContent from "@/components/apartment/ApartmentDetailContent";
import ChatWindow from "@/components/chat/ChatWindow";

export const metadata: Metadata = {
  title: "Estate Care | Apartment Detail",
  description: "View the details of an apartment, including tenants and more.",
};

interface ParamsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApartmentDetailPage({ params }: ParamsProps) {
  const resolvedParams = await params;

  return (
    <ProtectedRoute>
      <ApartmentDetailContent apartmentId={resolvedParams.id} />
      <ChatWindow apartmentId={resolvedParams.id} />
    </ProtectedRoute>
  );
}
