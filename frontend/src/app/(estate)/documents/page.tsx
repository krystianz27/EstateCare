import DocumentList from "@/components/documents/DocumentList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Documents",
  description:
    "Manage your documents: browse your own documents and view documents shared with you.",
};

export default function DocumentsPage() {
  return (
    <div className="my-4 rounded-3xl p-4 dark:bg-zinc-900">
      <DocumentList />
    </div>
  );
}
