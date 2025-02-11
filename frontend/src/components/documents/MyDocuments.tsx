"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useGetMyDocumentsQuery } from "@/lib/redux/features/document/documentApiSlice";
import DocumentCard from "../cards/DocumentCard";
import Spinner from "../shared/Spinner";
import PaginationLocal from "../shared/PaginationLocal";

export default function MyDocuments() {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type") || "owned";

  const { data, isLoading, isError } = useGetMyDocumentsQuery({
    type,
    page: currentPage,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error loading documents.</p>;

  const documents = data?.document?.results;
  const totalCount = data?.document?.count || 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 9) : 1;

  if (!documents || documents.length === 0) return <p>No documents found.</p>;

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
      <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}

//  PAGINATION WITH REDUX
// "use client";

// import React from "react";
// import { useGetMyDocumentsQuery } from "@/lib/redux/features/document/documentApiSlice";
// import DocumentCard from "../cards/DocumentCard";
// import Spinner from "../shared/Spinner";
// import PaginationSection from "../shared/Pagination";
// import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
// import { DocumentState } from "@/types";

// export default function MyDocuments() {
//   const page = useAppSelector((state: DocumentState) => state.document.page);

//   const { data, isLoading, isError } = useGetMyDocumentsQuery({
//     type: "owned",
//     page,
//   });

//   if (isLoading) return <Spinner />;
//   if (isError) return <p>Error loading documents.</p>;

//   const documents = data?.document?.results;

//   const totalCount = data?.document?.count || 0;
//   const totalPages = totalCount > 0 ? Math.ceil(totalCount / 9) : 1;

//   if (!documents || documents.length === 0) return <p>No documents found.</p>;

//   return (
//     <>
//       <div className="grid grid-cols-1 gap-4">
//         {documents.map((doc) => (
//           <DocumentCard key={doc.id} document={doc} />
//         ))}
//       </div>
//       <PaginationSection totalPages={totalPages} entityType="document" />
//     </>
//   );
// }
