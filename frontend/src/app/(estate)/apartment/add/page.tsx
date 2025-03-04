import ApartmentCreateForm from "@/components/forms/apartment/ApartmentCreateForm";
import { AuthFormHeader } from "@/components/forms/auth";
import type { Metadata } from "next";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";

export const metadata: Metadata = {
  title: "Estate Care Apartments | Create Apartment",
  description:
    "Add your apartment details and manage your property efficiently. Create and update your apartment information easily with Estate Care.",
};

export default function AddApartmentPage() {
  return (
    <ProtectedRoute>
      <div>
        <AuthFormHeader
          title="Add Your Apartment"
          staticText="Want to go back?"
          linkText="Back to Profile"
          linkHref="/profile"
        />
        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
            <ApartmentCreateForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
