import { useGetUserRelatedIssuesQuery } from "@/lib/redux/features/issue/issueApiSlice"; // Zmodyfikuj ścieżkę do API
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { JSX } from "react";

interface IssuesListProps {
  status?: string[];
}

const statusColors: Record<
  string,
  { label: string; color: string; icon: JSX.Element }
> = {
  reported: {
    label: "Reported",
    color: "bg-red-500",
    icon: <AlertCircle size={16} />,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-500",
    icon: <Clock size={16} />,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-500",
    icon: <CheckCircle size={16} />,
  },
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-300",
  medium: "bg-orange-400",
  high: "bg-red-500",
};

export default function IssuesUserRelated({ status }: IssuesListProps) {
  const { data, isLoading, error } = useGetUserRelatedIssuesQuery({ status });

  if (isLoading) {
    return <Skeleton className="my-4 h-24 w-full" />;
  }

  if (error) {
    return <p className="text-red-500">Error loading issues.</p>;
  }

  return (
    <div className="space-y-4">
      {data?.my_issues.count === 0 ? (
        <p className="text-gray-500">No issues found.</p>
      ) : (
        data?.my_issues.results.map((issue) => (
          <Card key={issue.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {issue.title}
                <Badge
                  className={`${statusColors[issue.status].color} text-white`}
                >
                  {statusColors[issue.status].icon}{" "}
                  {statusColors[issue.status].label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{issue.description}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>Reported by: {issue.reported_by}</span>
                {issue.assigned_to && (
                  <span>Assigned to: {issue.assigned_to}</span>
                )}
              </div>
              <div className="mt-2">
                <Badge
                  className={`${priorityColors[issue.priority]} text-white`}
                >
                  Priority: {issue.priority.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
