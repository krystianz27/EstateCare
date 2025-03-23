"use client";
import IssuesUserRelated from "@/components/issue/IssuesUserRelated";
import ActiveRentalContracts from "@/components/rental-contract/ActiveRentalContracts";

export default function WelcomePage() {
  return (
    <div className="relative my-2">
      <IssuesUserRelated status={["reported", "in_progress"]} />

      <ActiveRentalContracts />
    </div>
  );
}
