"use client";

import React from "react";
import {
  useDeleteApartmentMutation,
  useGetApartmentByIdQuery,
} from "@/lib/redux/features/apartment/apartmentApiSlice";
import { Button } from "../ui/button";
import Link from "next/link";
import Spinner from "../shared/Spinner";
import IssueList from "@/components/issue/IssuesList";
import ManageTenants from "./ManageTenants";
import TenantsSection from "./TenantsSection";
import { UserResponse } from "@/types";
import ActiveRentalContracts from "../rental-contract/ActiveRentalContracts";
import CreateUserByEmailForm from "../forms/auth/CreateUserByEmailForm";
import { useRouter } from "next/navigation";

interface ApartmentDetailContentProps {
  apartmentId: string;
  currentUser: UserResponse;
}

const ApartmentDetailContent: React.FC<ApartmentDetailContentProps> = ({
  apartmentId,
  currentUser,
}) => {
  const { data, isLoading, isError } = useGetApartmentByIdQuery(apartmentId);
  const [deleteApartment, { isLoading: isDeleting }] =
    useDeleteApartmentMutation();

  const router = useRouter();

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (isError || !data) {
    return <p>Error loading apartment details.</p>;
  }

  const apartment = data.apartment;
  const isOwner = currentUser.id === apartment.owner.id;

  const formatAddress = () => {
    let address = `${apartment.street}, `;

    if (apartment.building_number) {
      address += `Building ${apartment.building_number}, `;
    }

    if (apartment.apartment_number) {
      address += `Unit ${apartment.apartment_number}, `;
    }

    address += `${apartment.city}, ${apartment.postal_code}, ${apartment.country}`;
    return address;
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this apartment?",
    );
    if (!confirmed) return;

    try {
      await deleteApartment(apartment.id).unwrap();
      router.push("/apartments");
    } catch (error) {
      console.error("Failed to delete apartment:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container mx-auto rounded-2xl bg-slate-100 px-4 py-8 max-md:my-2 dark:bg-zinc-900">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Apartment Details</h1>
        <div className="mt-2 text-gray-700">
          <p>
            <strong>Address:</strong> {formatAddress()}
          </p>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold">Owner</h2>
        <p className="mt-2">
          {apartment.owner.first_name} {apartment.owner.last_name}
        </p>
      </section>
      <TenantsSection tenants={apartment.tenants || []} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Link
            href={`/apartment/report-issue?apartmentId=${apartmentId}`}
            passHref
          >
            <Button className="w-full bg-orange-500 text-white">
              Report Issue
            </Button>
          </Link>
        </div>

        {isOwner && (
          <>
            <div className="w-full sm:w-auto">
              <Link
                href={`/rentalcontracts/add?apartment_id=${apartmentId}`}
                passHref
              >
                <Button className="w-full bg-blue-500 text-white">
                  Add Rental Contract
                </Button>
              </Link>
            </div>

            <div className="w-full sm:w-auto">
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="w-full bg-red-600 text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Apartment"}
              </Button>
            </div>
          </>
        )}
      </div>

      <IssueList issues={apartment.issues} />

      {isOwner && <ActiveRentalContracts apartmentId={apartment.id} />}

      {isOwner && <ManageTenants apartmentId={apartment.id} />}

      {isOwner && <CreateUserByEmailForm apartmentId={apartment.id} />}
    </div>
  );
};

export default ApartmentDetailContent;
