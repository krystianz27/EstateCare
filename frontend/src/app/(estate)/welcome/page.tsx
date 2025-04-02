"use client";

import IssuesUserRelated from "@/components/issue/IssuesUserRelated";
import ActiveRentalContracts from "@/components/rental-contract/ActiveRentalContracts";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";

export default function WelcomePage() {
  return (
    <ProtectedRoute>
      <div className="relative">
        <IssuesUserRelated status={["reported", "in_progress"]} />

        <ActiveRentalContracts />
      </div>
    </ProtectedRoute>
  );
}
