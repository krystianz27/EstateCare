"use client";

import { useGetMyAssignedIssuesQuery } from "@/lib/redux/features/issue/issueApiSlice";
import React from "react";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import IssueCard from "../cards/IssueCard";
import clsx from "clsx";

export default function IssuesAsigned() {
  const {
    data: assignedIssues,
    isLoading,
    isError,
  } = useGetMyAssignedIssuesQuery("");

  const myAssignedIssues = assignedIssues?.assigned_issues;

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
          Failed to load assigned issues. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <TabsContent value="assigned-issues">
      <h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin text-xl">
        Total: ({myAssignedIssues?.count || 0})
      </h2>
      <div
        className={clsx("m-4 grid cursor-pointer gap-4 p-1.5", {
          "grid-cols-1":
            !myAssignedIssues || myAssignedIssues.results.length === 0,
          "md:grid-cols-2 lg:grid-cols-3":
            myAssignedIssues && myAssignedIssues.results.length > 0,
        })}
      >
        {myAssignedIssues && myAssignedIssues.results.length > 0 ? (
          myAssignedIssues.results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <p className="h2-semibold dark:text-lime-500">
            You have no assigned issues at the moment.
          </p>
        )}
      </div>
    </TabsContent>
  );
}
