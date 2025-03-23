import { useGetUserRelatedIssuesV2Query } from "@/lib/redux/features/issue/issueApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import IssueCard from "../cards/IssueCard";
import { useSearchParams, useRouter } from "next/navigation";
import PaginationLocal from "../shared/PaginationLocal";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

interface IssuesListProps {
  status?: string;
}

export default function IssuesUserRelated({
  status: initialStatus,
}: IssuesListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const urlStatus = searchParams.get("status");

  // Status state (priority: URL > props)
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    urlStatus !== null ? urlStatus : initialStatus,
  );

  useEffect(() => {
    setSelectedStatus(urlStatus !== null ? urlStatus : initialStatus);
  }, [urlStatus, initialStatus]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value || undefined;
    setSelectedStatus(value);

    const newSearchParams = new URLSearchParams();
    if (value) {
      newSearchParams.set("status", value);
    }
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const { data, isLoading, error } = useGetUserRelatedIssuesV2Query({
    status: selectedStatus,
    page: currentPage,
  });

  if (isLoading) {
    return <Skeleton className="my-4 h-24 w-full" />;
  }

  if (error) {
    return <p className="text-red-500">Error loading issues.</p>;
  }

  const totalPages = data ? Math.ceil(data.my_issues.count / 10) : 0;

  return (
    <div className="bg-lightGrey mx-2 flex flex-col gap-4 rounded-lg p-4 dark:bg-zinc-900">
      <div className="flex justify-center">
        <Link href="/issue/report-issue">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full rounded-lg bg-zinc-800 text-white sm:w-64">
            Report New Issue
          </Button>
        </Link>
      </div>
      <h2 className="text-2xl font-semibold">Issues</h2>
      <div className="mb-6">
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Filter by Status
        </label>
        <select
          id="status"
          value={selectedStatus || ""}
          onChange={handleStatusChange}
          className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-700"
        >
          <option value="">All</option>
          <option value="reported">Reported</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin text-xl">
        Total: ({data?.my_issues.count || 0})
      </h2>

      <div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 p-1.5 md:grid-cols-2 lg:grid-cols-3">
        {data?.my_issues.count === 0 ? (
          <p className="text-gray-500">No issues found.</p>
        ) : (
          data?.my_issues.results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
