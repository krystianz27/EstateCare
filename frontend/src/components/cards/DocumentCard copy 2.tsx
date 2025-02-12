"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import {
  useDeleteDocumentMutation,
  useRevokeShareDocumentMutation,
  useShareDocumentMutation,
} from "@/lib/redux/features/document/documentApiSlice";
import DocumentAccessDialog from "@/components/documents/DocumentAccessDialog";
import { DocumentResponseData } from "@/types/document";

interface DocumentCardProps {
  document: DocumentResponseData;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const [deleteDocument] = useDeleteDocumentMutation();
  const [shareDocument] = useShareDocumentMutation();
  const [revokeShareDocument] = useRevokeShareDocumentMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Stan dla otwarcia dialogu

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
      alert("Document shared successfully.");
    } catch (error) {
      alert("Failed to share document.");
    }
  };

  const handleRevokeAccess = async (userIds: string[]) => {
    try {
      await revokeShareDocument({
        id: document.id,
        shared_with: userIds,
      }).unwrap();
      alert("Access revoked.");
    } catch (error) {
      alert("Failed to revoke access.");
    }
  };

  return (
    <Card className="rounded-lg border border-zinc-600 p-4 shadow-sm hover:bg-zinc-800">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{document.title}</h3>
        <p className="text-xs text-gray-400">
          Created on {format(new Date(document.created_at), "dd MMM yyyy")}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Uploaded by: {document.uploaded_by_user_data.full_name} (
          {document.uploaded_by_user_data.username})
        </p>

        <div className="mt-4 flex justify-between gap-2">
          {/* Przycisk do otwierania modala */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)} // Otwórz modal po kliknięciu
            className="border-blue-600 bg-blue-600 text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Manage Access
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-green-600 bg-green-600 text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Download
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)} // Otwórz modal po kliknięciu
            className="border-yellow-600 bg-yellow-600 text-white transition-colors duration-200 hover:border-yellow-700 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)} // Otwórz modal po kliknięciu
            className="border-red-600 bg-red-600 text-white transition-colors duration-200 hover:border-red-700 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Revoke Access
          </Button>

          <Button
            className="border-red-800 bg-red-800 text-white transition-colors duration-200 hover:border-red-900 hover:bg-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Modal do zarządzania dostępem */}
      <DocumentAccessDialog
        documentId={document.id}
        onShare={handleShare}
        onRevoke={handleRevokeAccess}
        sharedWithUsers={document.shared_with_users.map((user) => user.id)}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} // Funkcja do zamknięcia modala
      />
    </Card>
  );
}
