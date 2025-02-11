"use client";

import React from "react";
import { useGetMyDocumentsQuery } from "@/lib/redux/features/document/documentApiSlice";
import DocumentCard from "../cards/DocumentCard";
import Spinner from "../shared/Spinner";

export default function MyDocuments() {
  const { data, isLoading, isError } = useGetMyDocumentsQuery();

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error loading documents.</p>;

  const documents = data?.document?.results;

  if (!documents || documents.length === 0) return <p>No documents found.</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
