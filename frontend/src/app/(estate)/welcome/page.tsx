"use client";
import IssuesUserRelated from "@/components/issue/IssuesUserRelated";
import ActiveRentalContracts from "@/components/rental-contract/ActiveRentalContracts";

export default function WelcomePage() {
  return (
    <div className="relative mb-8 ">
      {/* <div className="bg-lightGrey relative mb-8 dark:bg-zinc-900"> */}

      <h2 className="text-2xl font-semibold">Active Issues</h2>
      <IssuesUserRelated status={["reported", "in_progress"]} />

      <ActiveRentalContracts />
    </div>
  );
}
