import React, { useState } from "react";
import { IssueForApartmentResponse } from "@/types";
import Link from "next/link";
import { statusOptions } from "@/constant";

interface IssueListProps {
  issues: IssueForApartmentResponse[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  const [areAllIssuesOpen, setAreAllIssuesOpen] = useState(false);

  const toggleAllIssues = () => {
    setAreAllIssuesOpen(!areAllIssuesOpen);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold">Issues</h3>
      <button
        onClick={toggleAllIssues}
        className="my-4 text-blue-500 hover:text-blue-700"
      >
        {areAllIssuesOpen ? "Hide All Details" : "Show All Details"}
      </button>
      <ul className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueAccordion
              key={issue.id}
              issue={issue}
              isOpen={areAllIssuesOpen}
            />
          ))
        ) : (
          <p>No issues reported for this apartment.</p>
        )}
      </ul>
    </div>
  );
};

const IssueAccordion: React.FC<{
  issue: IssueForApartmentResponse;
  isOpen: boolean;
}> = ({ issue, isOpen }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(isOpen);

  React.useEffect(() => {
    setIsDetailsOpen(isOpen);
  }, [isOpen]);

  const toggleAccordion = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <li className="rounded-md border-b border-gray-300 bg-gray-100 p-4 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div className="flex items-center justify-between">
        <Link href={`/issue/${issue.id}`} className="flex items-center gap-4">
          <h4 className="text-lg font-semibold">{issue.title}</h4>
          <span
            className={`rounded px-2 py-1 text-sm font-medium ${
              issue.status === "resolved"
                ? "bg-green-500 text-white"
                : issue.status === "in_progress"
                  ? "bg-yellow-500 text-black"
                  : "bg-red-500 text-white"
            }`}
          >
            <p>
              {statusOptions.find((option) => option.value === issue.status)
                ?.label || issue.status}
            </p>
          </span>
        </Link>
        <button
          onClick={toggleAccordion}
          className="text-blue-500 hover:text-blue-700"
        >
          {isDetailsOpen ? "Hide Details" : "Show Details"}
        </button>
      </div>
      {isDetailsOpen && (
        <div className="mt-2">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Description: </strong>
            {issue.description}
          </p>
          {issue.resolved_on ? (
            <p className="mt-2 text-sm">
              <strong>Resolved On:</strong>{" "}
              {new Date(issue.resolved_on).toLocaleDateString()}
            </p>
          ) : (
            <p className="mt-2 text-sm">
              <strong>Resolved On:</strong> Not Resolved
            </p>
          )}
          <p className="mt-2 text-sm">
            <strong>Priority:</strong> {issue.priority}
          </p>
        </div>
      )}
    </li>
  );
};

export default IssueList;
