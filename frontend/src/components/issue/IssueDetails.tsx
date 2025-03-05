"use client";

import {
  useDeleteIssueMutation,
  useGetSingleIssueQuery,
} from "@/lib/redux/features/issue/issueApiSlice";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { extractErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AuthFormHeader } from "../forms/auth";
import { CheckCheck, CircleDot, EyeIcon, Hotel } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface IssueDetailsProps {
  params: {
    id: string;
  };
}

export default function IssueDetails({ params }: IssueDetailsProps) {
  const { id } = params;

  const { data: currentUser } = useGetUserProfileQuery();

  const { data: issueData, isError } = useGetSingleIssueQuery(id);
  const issue = issueData?.issue;

  const router = useRouter();

  // const canUpdate = issue?.assigned_to === currentUser?.profile.full_name;
  const canUpdate = true;
  const canDelete = issue?.reported_by === currentUser?.profile.full_name;

  const [deleteIssue] = useDeleteIssueMutation();

  const handleDeleteIssue = async () => {
    if (issue?.id) {
      try {
        await deleteIssue(issue.id).unwrap();
        router.push("/profile");
        toast.success("Your Issue was deleted");
      } catch (e) {
        const errorMessage = extractErrorMessage(e);
        toast.error(errorMessage ?? "An error occurred");
      }
    }
  };

  if (isError || !issue) {
    return <div>Error loading issue details.</div>;
  }

  return (
    <Card className="dark:border-gray rounded-xl border border-dashed">
      <AuthFormHeader
        title={issue.title}
        linkText="Back to profile"
        linkHref="/profile"
      />

      <div className="my-4 text-center">
        <Link
          href="/apartment"
          className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-lime-500 dark:hover:text-indigo-500"
        >
          Back to Apartments
        </Link>
      </div>

      <CardHeader className="border-b-eerieBlack flex flex-col justify-between gap-4 border-b p-4 sm:p-6 md:flex-row md:items-center md:gap-6">
        <div className="grid gap-0.5">
          <CardTitle className="dark:text-platinum">
            <p className="flex items-center space-x-2">
              <Hotel className="tab-icon" />
              <span className="dark:text-babyPowder font-bold">Apartment:</span>
              <span className="text-2xl">
                {issue.apartment_unit?.apartment_number}{" "}
                {issue.apartment_unit?.street},{" "}
                {issue.apartment_unit?.building_number}
              </span>
            </p>
          </CardTitle>

          <CardDescription className="mt-2 flex items-center space-x-2">
            <CheckCheck className="tab-icon" />
            <span className="text-xl-font-baby">Reported By:</span>
            <span className="text-xl-font-baby">{issue.reported_by}</span>
          </CardDescription>

          <CardDescription className="mt-2 flex items-center space-x-2">
            <CheckCheck className="tab-icon" />
            <span className="text-xl-font-baby">City:</span>
            <span className="text-xl-font-baby">
              {issue.apartment_unit?.city}
            </span>
          </CardDescription>

          <CardDescription className="mt-2 flex items-center space-x-2">
            <CheckCheck className="tab-icon" />
            <span className="text-xl-font-baby">Postal Code:</span>
            <span className="text-xl-font-baby">
              {issue.apartment_unit?.postal_code}
            </span>
          </CardDescription>

          <CardDescription className="mt-2 flex items-center space-x-2">
            <CheckCheck className="tab-icon" />
            <span className="text-xl-font-baby">Country:</span>
            <span className="text-xl-font-baby">
              {issue.apartment_unit?.country}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="border-b-eerieBlack border-b">
        <CardDescription className="mt-3 flex items-center space-x-2">
          <CircleDot className="tab-icon" />
          <span className="text-xl-font-baby">{issue.description}</span>
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-2 flex flex-col gap-4 text-center sm:flex-col sm:text-left dark:text-lime-500">
        <p className="text-lg">
          Assigned to:&nbsp;
          <span className="dark:text-platinum">
            {issue.assigned_to ?? "Not assigned Yet!"}
          </span>
        </p>
        <p className="text-lg">
          Status:&nbsp;
          <span className="dark:text-platinum">{issue.status}</span>
        </p>
        <p className="text-lg">
          Priority:&nbsp;
          <span className="dark:text-platinum">{issue.priority}</span>
        </p>
        <p className="flex items-center">
          <EyeIcon className="mr-1 size-5" />
          <span className="dark:text-platinum text-lg">
            View Count:&nbsp; {issue.view_count}
          </span>
        </p>
      </CardFooter>

      <div className="mt-4 flex flex-col gap-y-3">
        {canUpdate && (
          <Link href={`/issue/update-issue/${id}`} className="w-full">
            <Button
              className="bg-electricIndigo text-babyPowder dark:bg-electricIndigo dark:text-babyPowder h-10 w-full"
              size="sm"
              variant="outline"
            >
              Update Issue
            </Button>
          </Link>
        )}

        {canDelete && (
          <Button
            onClick={handleDeleteIssue}
            className="text-babyPowder dark:text-babyPowder h-10 w-full bg-red-500 dark:bg-red-500"
            size="sm"
            variant="outline"
          >
            Delete Issue
          </Button>
        )}
      </div>
    </Card>
  );
}
