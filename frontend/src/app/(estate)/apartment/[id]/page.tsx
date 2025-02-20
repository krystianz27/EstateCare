import ApartmentDetailContent from "@/components/apartment/ApartmentDetailContent";
import type { Metadata } from "next";

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
    <>
      <ApartmentDetailContent apartmentId={resolvedParams.id} />
    </>
  );
}
