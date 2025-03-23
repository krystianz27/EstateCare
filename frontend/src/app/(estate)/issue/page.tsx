"use client";
import IssuesUserRelatedList from "@/components/issue/IssuesUserRelatedList";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";

export default function WelcomePage() {
  return (
    <ProtectedRoute>
      <div className="relative mb-8 ">
        <IssuesUserRelatedList />
      </div>
    </ProtectedRoute>
  );
}
