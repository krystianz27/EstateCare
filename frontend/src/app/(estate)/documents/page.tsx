import DocumentList from "@/components/documents/DocumentList";
import type { Metadata } from "next";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";

export const metadata: Metadata = {
  title: "Estate Care | Documents",
  description:
    "Manage your documents: browse your own documents and view documents shared with you.",
};

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <div className="rounded-3xl p-4 max-md:my-2 dark:bg-zinc-900">
        <DocumentList />
      </div>
    </ProtectedRoute>
  );
}
