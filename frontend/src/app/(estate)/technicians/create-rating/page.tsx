import RatingCreateForm from "@/components/forms/rating/RatingCreateForm";
import { AuthFormHeader } from "@/components/forms/auth";
import type { Metadata } from "next";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";

export const metadata: Metadata = {
  title: "Estate Care | Add Rating",
  description:
    "Tenants can provide ratings for technicians based on their satisfaction with the services provided.",
};

export default function AddRatingPage() {
  return (
    <ProtectedRoute>
      <div>
        <AuthFormHeader
          title="Rate a Technician"
          staticText="We'd love to hear your feedback on the services provided"
          linkText="Back to Technicians List"
          linkHref="/technicians"
        />
        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
            <RatingCreateForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
