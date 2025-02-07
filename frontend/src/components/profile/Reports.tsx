"use client";

import { useGetMyReportsQuery } from "@/lib/redux/features/report/reportApiSlice";
import React from "react";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "@/utils";

export default function Reports() {
  const { data, isLoading } = useGetMyReportsQuery();
  const myReport = data?.reports;

  if (isLoading) {
    <div className="flex-center pt-32">
      <Spinner size="xl" />
    </div>;
  }
  return (
    <TabsContent value="my-reports">
      <h2 className="h2-semibold flex-center font-robotoSlab text-xl dark:text-pumpkin">
        Total: ({myReport?.count})
      </h2>
      <div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 p-1.5 md:grid-cols-2 lg:grid-cols-3">
        {myReport && myReport.results.length > 0 ? (
          myReport.results.map((report) => (
            <Card
              key={report.id}
              className="rounded-xl border border-dashed hover:border-pumpkin dark:border-gray hover:dark:border-platinum"
            >
              <CardHeader>
                <CardTitle className="flex-center h3-semibold font-robotoSlab dark:text-lime-500">
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-platinum">
                  <p className="h4-semibold">{report.description}</p>
                </CardDescription>
              </CardContent>

              <CardFooter className="flex flex-row justify-between dark:text-babyPowder">
                <div>
                  <span className="mr-0.5 font-bold dark:text-pumpkin">
                    Created On:{" "}
                  </span>
                  <Badge className="bg-eerieBlack text-babyPowder dark:bg-electricIndigo dark:text-babyPowder">
                    {formatDate(report.created_at).toString()}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="h2-semibold dark:text-lime-500">
            You have not Reported any Tenant(s) Yet!
          </p>
        )}
      </div>
    </TabsContent>
  );
}
