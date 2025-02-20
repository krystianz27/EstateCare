import ApartmentsMy from "@/components/apartment/ApartmentsMy";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Apartments",
  description:
    "Explore your apartments. The 'Apartments' section allows tenants to create and manage their flat to connect with the community.",
};

export default function MyApartments() {
  return (
    <ProtectedRoute>
      <ApartmentsMy />
    </ProtectedRoute>
  );
}
