import React from "react";
import { IssueForApartmentResponse } from "@/types";

interface IssueListProps {
  issues: IssueForApartmentResponse[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold">Issues</h3>
      <ul className="mt-4 space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <li
              key={issue.title}
              className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
            >
              <h4 className="text-lg font-semibold">{issue.title}</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {issue.description}
              </p>
              <p className="mt-2 text-sm">
                <strong>Status:</strong> {issue.status}
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
            </li>
          ))
        ) : (
          <p>No issues reported for this apartment.</p>
        )}
      </ul>
    </div>
  );
};

export default IssueList;
