import { useGetUserRelatedIssuesQuery } from "@/lib/redux/features/issue/issueApiSlice"; // Zmodyfikuj ścieżkę do API
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { JSX } from "react";
import IssueCard from "../cards/IssueCard";

interface IssuesListProps {
  status?: string[];
}

// const statusColors: Record<
//   string,
//   { label: string; color: string; icon: JSX.Element }
// > = {
//   reported: {
//     label: "Reported",
//     color: "bg-red-500",
//     icon: <AlertCircle size={16} />,
//   },
//   in_progress: {
//     label: "In Progress",
//     color: "bg-yellow-500",
//     icon: <Clock size={16} />,
//   },
//   resolved: {
//     label: "Resolved",
//     color: "bg-green-500",
//     icon: <CheckCircle size={16} />,
//   },
// };

// const priorityColors: Record<string, string> = {
//   low: "bg-gray-300",
//   medium: "bg-orange-400",
//   high: "bg-red-500",
// };

export default function IssuesUserRelated({ status }: IssuesListProps) {
  const { data, isLoading, error } = useGetUserRelatedIssuesQuery({ status });

  if (isLoading) {
    return <Skeleton className="my-4 h-24 w-full" />;
  }

  if (error) {
    return <p className="text-red-500">Error loading issues.</p>;
  }

  return (
    <div className="bg-lightGrey mx-2 flex flex-col gap-4 dark:bg-zinc-900">
      {data?.my_issues.count === 0 ? (
        <p className="text-gray-500">No issues found.</p>
      ) : (
        data?.my_issues.results.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))
      )}
    </div>
  );
}
