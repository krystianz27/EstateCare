import RentalContractDetail from "@/components/rental-contract/RentalContractDetail";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Rental Contract Details",
  description:
    "View detailed information about the rental contract, including tenant, owner, and contract dates. Authenticated users can manage or view the contract details.",
};

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export default async function RentalContractDetailPage({
  params,
}: ParamsProps) {
  const resolvedParams = await params;
  return (
    <ProtectedRoute>
      <div>
        <RentalContractDetail contractId={resolvedParams.id} />
      </div>
    </ProtectedRoute>
  );
}
