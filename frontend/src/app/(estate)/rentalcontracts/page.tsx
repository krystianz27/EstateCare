import AllRentalContracts from "@/components/rental-contract/AllRentalContracts";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Rental Contracts",
  description:
    "Explore and manage all rental contracts. The 'Rental Contracts' section allows landlords and tenants to view and manage rental agreements.",
};

export default function AllRentalContractsPage() {
  return (
    <ProtectedRoute>
      <div className="bg-inherit sm:mx-auto sm:w-full">
        <AllRentalContracts />
      </div>
    </ProtectedRoute>
  );
}
