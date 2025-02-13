"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { format } from "date-fns";
import {
  useDeleteDocumentMutation,
  useRevokeShareDocumentMutation,
  useShareDocumentMutation,
} from "@/lib/redux/features/document/documentApiSlice";
import DocumentAccessDialog from "@/components/documents/DocumentAccessDialog";
import { DocumentResponseData } from "@/types/document";
import { toast } from "react-toastify";

interface DocumentCardProps {
  document: DocumentResponseData;
  isShared: boolean;
}

export default function DocumentCard({
  document,
  isShared,
}: DocumentCardProps) {
  const [deleteDocument] = useDeleteDocumentMutation();
  const [shareDocument] = useShareDocumentMutation();
  const [revokeShareDocument] = useRevokeShareDocumentMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // Stan dla otwarcia dialogu
  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false); // Zamknięcie modala bez usuwania
  };

  const handleDownload = () => {
    const fileUrl = document.file_url.startsWith("/")
      ? `${process.env.NEXT_PUBLIC_DOMAIN}${document.file_url}`
      : document.file_url;

    const link = window.document.createElement("a");
    link.href = fileUrl;
    link.download = document.title;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(document.id).unwrap();
      alert("Document deleted successfully.");
    } catch (error) {
      alert("Failed to delete document.");
    }
  };

  const handleShare = async (userIds: string[]) => {
    try {
      await shareDocument({ id: document.id, shared_with: userIds }).unwrap();
      toast.success("Document shared successfully.");
    } catch (error) {
      toast.error("Failed to share document.");
    }
  };

  const handleRevokeAccess = async (userIds: string[]) => {
    try {
      await revokeShareDocument({
        id: document.id,
        shared_with: userIds,
      }).unwrap();
      toast.success("Access revoked.");
    } catch (error) {
      toast.error("Failed to revoke access.");
    }
  };

  return (
    <Card className="rounded-lg border border-zinc-600 p-4 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{document.title}</h3>
        <p className="text-xs text-gray-400">
          Created on {format(new Date(document.created_at), "dd MMM yyyy")}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Uploaded by: {document.uploaded_by_user_data.full_name} (
          {document.uploaded_by_user_data.username})
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="mt-4 border-green-600 bg-green-600 text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Download
        </Button>

        <div className="flex w-full flex-col gap-6 py-6">
          {!isShared && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="w-full border-blue-600 bg-blue-600 text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Manage Access
              </Button>

              <Button
                className="w-full border-red-800 bg-red-800 text-white transition-colors duration-200 hover:border-red-900 hover:bg-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                variant="destructive"
                size="sm"
                onClick={() => setIsConfirmDeleteOpen(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <DocumentAccessDialog
        documentId={document.id}
        onShare={handleShare}
        onRevoke={handleRevokeAccess}
        sharedWithUsers={document.shared_with_users}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
    </Card>
  );
}
