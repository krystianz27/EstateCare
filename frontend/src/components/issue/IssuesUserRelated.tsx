import { useGetUserRelatedIssuesQuery } from "@/lib/redux/features/issue/issueApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import IssueCard from "../cards/IssueCard";
import { useSearchParams } from "next/navigation";
import PaginationLocal from "../shared/PaginationLocal";
import Link from "next/link";
import { Button } from "../ui/button";

interface IssuesListProps {
  status?: string[];
}

export default function IssuesUserRelated({ status }: IssuesListProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error } = useGetUserRelatedIssuesQuery({
    status,
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
    <div className="bg-lightGrey mx-2 flex flex-col gap-4 rounded-2xl dark:bg-zinc-900">
      <h2 className="pt-2 text-center text-2xl font-semibold">Active Issues</h2>

      <div className="flex justify-center">
        <Link href="/issue">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full rounded-lg bg-zinc-800 text-white sm:w-64">
            See All Issues
          </Button>
        </Link>
      </div>

      <div className="grid cursor-pointer grid-cols-1 gap-4 p-1.5 md:grid-cols-2 lg:grid-cols-3">
        {data?.my_issues.count === 0 ? (
          <p className="text-gray-500">No issues found.</p>
        ) : (
          data?.my_issues.results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
