import { AuthFormHeader } from "@/components/forms/auth";
import IssueCreateForm from "@/components/forms/issue/IssueCreateForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care Apartments | Report Issue",
  description:
    "Easily report any issues or maintenance requests directly to management, ensuring your apartment stays in top condition.",
};

export default function ReportIssuePage() {
  return (
    <div>
      <AuthFormHeader title="Report an issue with your Apartment" />
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
          <IssueCreateForm />
        </div>
      </div>
    </div>
  );
}
