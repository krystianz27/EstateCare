import RentalContractUpdateForm from "@/components/forms/rental-contract/RentalContractUpdateForm";

import type { Metadata } from "next";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import AuthFormHeader from "@/components/forms/auth/AuthFormHeader";

export const metadata: Metadata = {
  title: "Estate Care | Edit Rental Contract",
  description:
    "Update the details of your rental contract, including terms and conditions. Ensure your information is accurate to keep records up to date.",
};

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export default async function RentalContractUpdatePage({
  params,
}: ParamsProps) {
  const resolvedParams = await params;
  return (
    <ProtectedRoute>
      <div>
        <AuthFormHeader title="Update a Rental Contract" />
        <div className="mt-7 bg-inherit sm:mx-auto sm:w-full sm:max-w-[600px]">
          <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
            <RentalContractUpdateForm contractId={resolvedParams.id} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
