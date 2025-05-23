import { AuthFormHeader } from "@/components/forms/auth";
import RentalContractCreateForm from "@/components/forms/rental-contract/RentalContractCreateForm";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care Apartments | Create Rental Contract",
  description:
    "Create a new rental contract to manage your apartment rentals efficiently.",
};

export default function RentalContractCreatePage() {
  return (
    <ProtectedRoute>
      <div>
        <AuthFormHeader title="Create a Rental Contract" />
        <div className="mt-7 bg-inherit sm:mx-auto sm:w-full sm:max-w-[600px]">
          <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
            <RentalContractCreateForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
