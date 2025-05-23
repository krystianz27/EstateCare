import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hotel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types";

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issue/${issue.id}`} key={issue.id}>
      <Card
        key={issue.id}
        className="hover:border-pumpkin dark:border-gray hover:dark:border-platinum rounded-xl border border-dashed"
      >
        <CardHeader>
          <CardTitle className="flex-center h3-semibold font-robotoSlab dark:text-lime-500">
            {issue.title.length > 20
              ? `${issue.title.substring(0, 20)}....`
              : issue.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="dark:text-platinum">
            <p className="h4-semibold">
              {issue.description.length > 35
                ? `${issue.description.substring(0, 35)}....`
                : issue.description}
            </p>
          </CardDescription>
        </CardContent>

        <CardContent>
          <CardDescription className="dark:text-platinum">
            <p className="flex items-center space-x-2">
              <Hotel className="tab-icon" />
              <span className="tab-font text-lg">
                {issue.apartment_unit.street || ""}{" "}
                {issue.apartment_unit.building_number || ""}
                {issue.apartment_unit.apartment_number
                  ? ` / ${issue.apartment_unit.apartment_number}`
                  : ""}{" "}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Street: </span>
              <span className="text-lg">{issue.apartment_unit.street}</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Building Number: </span>
              <span className="text-lg">
                {issue.apartment_unit.building_number || "N/A"}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Apartment Number: </span>
              <span className="text-lg">
                {issue.apartment_unit.apartment_number || "N/A"}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">City: </span>
              <span className="text-lg">{issue.apartment_unit.city}</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Postal Code: </span>
              <span className="text-lg">
                {issue.apartment_unit.postal_code || "N/A"}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Country: </span>
              <span className="text-lg">{issue.apartment_unit.country}</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Estimated Repair date: </span>
              <span className="text-lg">{issue.estimated_repair_date}</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="tab-font">Repair Duration: </span>
              <span className="text-lg">{issue.repair_duration}</span>
            </p>
          </CardDescription>
        </CardContent>

        <CardFooter className="dark:text-babyPowder flex flex-row justify-between">
          <div>
            <span className="mr-0.5 font-bold">Status: </span>
            <Badge
              className={`text-babyPowder ${
                issue.status === "reported"
                  ? "bg-red-600"
                  : issue.status === "in_progress"
                    ? "bg-orange-400"
                    : issue.status === "resolved"
                      ? "bg-green-600"
                      : "bg-gray-500"
              }`}
            >
              {issue.status}
            </Badge>
          </div>

          <div>
            <span className="mr-0.5 font-bold">Priority: </span>
            <Badge
              className={`text-babyPowder ${
                issue.priority === "low"
                  ? "bg-green-600"
                  : issue.priority === "medium"
                    ? "bg-orange-400"
                    : issue.priority === "high"
                      ? "bg-red-600"
                      : "bg-gray-500"
              }`}
            >
              {issue.priority}
            </Badge>
          </div>

          <div>
            <span className="mr-0.5 font-bold">View Count: </span>
            <span className="dark:text-platinum text-lg">
              {issue.view_count}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
