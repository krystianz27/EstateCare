import { AuthFormHeader } from "@/components/forms/auth";
import ReportCreateForm from "@/components/forms/report/ReportCreateForm";
import ProtectedRoutes from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Report Tenant",
  description:
    "Report tenant misconduct or inappropriate behavior easily and anonymously.",
};

export default function ReportTenantPage() {
  return (
    <ProtectedRoutes>
      <div>
        <AuthFormHeader
          title="Report a Tenant"
          staticText="All reports are confidential. We will take appropriate action without revealing your identity."
          linkText="Back to Profile"
          linkHref="/profile"
        />
        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="rounded-xl bg-lightGrey px-6 py-12 shadow dark:bg-deepBlueGrey sm:rounded-lg sm:px-12 md:rounded-3xl">
            <ReportCreateForm />
          </div>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
