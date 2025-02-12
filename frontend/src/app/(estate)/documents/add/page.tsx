import type { Metadata } from "next";

import DocumentAddForm from "@/components/forms/documents/DocumentAddForm";
import { AuthFormHeader } from "@/components/forms/auth";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";

export const metadata: Metadata = {
  title: "Estate Care | Add Document",
  description: "Upload and share your document with others in the system.",
};

export default function AddDocumentPage() {
  return (
    <ProtectedRoute>
      <div>
        <AuthFormHeader
          title="Add a Document"
          staticText="Fill out the form below to upload your document."
          linkText="Back to Documents"
          linkHref="/documents"
        />
        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
            <DocumentAddForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
