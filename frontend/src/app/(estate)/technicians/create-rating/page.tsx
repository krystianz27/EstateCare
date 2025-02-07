import RatingCreateForm from "@/components/forms/rating/RatingCreateForm";
import { AuthFormHeader } from "@/components/forms/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Add Rating",
  description:
    "Tenants can provide ratings for technicians based on their satisfaction with the services provided.",
};

export default function AddRatingPage() {
  return (
    <div>
      <AuthFormHeader
        title="Rate a Technician"
        staticText="We'd love to hear your feedback on the services provided"
        linkText="Back to Technicians List"
        linkHref="/technicians"
      />

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="rounded-xl bg-lightGrey px-6 py-12 shadow dark:bg-deepBlueGrey sm:rounded-lg sm:px-12 md:rounded-3xl">
          <RatingCreateForm />
        </div>
      </div>
    </div>
  );
}
