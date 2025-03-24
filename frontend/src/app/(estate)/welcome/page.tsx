"use client";

import IssuesUserRelated from "@/components/issue/IssuesUserRelated";
import ActiveRentalContracts from "@/components/rental-contract/ActiveRentalContracts";

export default function WelcomePage() {
  return (
    <div className="relative">
      <IssuesUserRelated status={["reported", "in_progress"]} />

      <ActiveRentalContracts />
    </div>
  );
}
