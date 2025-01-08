import TenantCard from "@/components/cards/TenantCard";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Tenants",
  description: "View and manage all tenants in your estate.",
};

function TenantPageContent() {
  return (
    <div>
      <TenantCard />
    </div>
  );
}

export default function TenantsPage() {
  return (
    <ProtectedRoute>
      <TenantPageContent />
    </ProtectedRoute>
  );
}
