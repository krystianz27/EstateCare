import React, { useState } from "react";
import { IssueForApartmentResponse } from "@/types";
import Link from "next/link";

interface IssueListProps {
  issues: IssueForApartmentResponse[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  const [areIssuesOpen, setAreIssuesOpen] = useState(false); // Stan do rozwijania/zwijania wszystkich zgłoszeń

  const toggleAllIssues = () => {
    setAreIssuesOpen(!areIssuesOpen);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold">Issues</h3>
      <button
        onClick={toggleAllIssues}
        className="mb-6 mt-4 text-blue-500 hover:text-blue-700"
      >
        {areIssuesOpen ? "Hide All Details" : "Show All Details"}
      </button>
      <ul className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueAccordion
              key={issue.title}
              issue={issue}
              isOpen={areIssuesOpen} // Przekazujemy stan rozwinięcia całej sekcji
            />
          ))
        ) : (
          <p>No issues reported for this apartment.</p>
        )}
      </ul>
    </div>
  );
};

// Komponent Accordion dla każdego zgłoszenia
const IssueAccordion: React.FC<{
  issue: IssueForApartmentResponse;
  isOpen: boolean; // Nowy prop do sterowania rozwijaniem/zwijaniem
}> = ({ issue, isOpen }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(isOpen);

  // Aktualizujemy stan rozwinięcia, jeśli zmieni się `isOpen` z parenta
  React.useEffect(() => {
    setIsDetailsOpen(isOpen);
  }, [isOpen]);

  const toggleAccordion = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <Link href={`/issue/${issue.id}`} key={issue.id}>
      <li
        className="rounded-md bg-gray-100 p-4 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        style={{ borderBottom: "1px solid #ddd" }} // Linia oddzielająca poszczególne zgłoszenia
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">{issue.title}</h4>
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
          </div>
        )}
      </li>
    </Link>
  );
};

export default IssueList;
