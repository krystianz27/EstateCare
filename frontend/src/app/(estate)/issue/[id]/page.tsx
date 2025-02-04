import IssueDetails from "@/components/issue/IssueDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Issue Details",
  description:
    "View detailed information about the issue you've reported, including its status and priority. Authenticated users can also update or delete the issue.",
};

// interface ParamsProps {
//   params: {
//     id: string;
//   };
// }

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export default async function IssueDetailPage({ params }: ParamsProps) {
  const resolvedParams = await params;
  return (
    <div>
      <IssueDetails params={resolvedParams} />
    </div>
  );
}
