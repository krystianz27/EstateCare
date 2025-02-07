"use client";

import { useGetMyIssuesQuery } from "@/lib/redux/features/issue/issueApiSlice";
import React from "react";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import IssueCard from "../cards/IssueCard";

export default function Issues() {
  const { data, isLoading, isError } = useGetMyIssuesQuery();
  const myIssues = data?.my_issues;

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-center pt-32">
        <p className="h2-semibold dark:text-red-500">
          Failed to load issues. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <TabsContent value="my-issues">
      <h2 className="h2-semibold flex-center font-robotoSlab text-xl dark:text-pumpkin">
        Total: ({myIssues?.count || 0})
      </h2>
      <div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 p-1.5 md:grid-cols-2 lg:grid-cols-3">
        {myIssues && myIssues.results.length > 0 ? (
          myIssues.results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <p className="h2-semibold dark:text-lime-500">
            No issues reported yet!
          </p>
        )}
      </div>
    </TabsContent>
  );
}
