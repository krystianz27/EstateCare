"use client";

import React from "react";
import { useGetApartmentByIdQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import { Button } from "../ui/button";
import Link from "next/link";
import Spinner from "../shared/Spinner";
import IssueList from "@/components/issue/IssuesList";
import ManageTenants from "./ManageTenants";
import TenantsSection from "./TenantsSection";
import { UserResponse } from "@/types";
import ActiveRentalContracts from "../rental-contract/ActiveRentalContracts";
import CreateUserByEmailForm from "../forms/auth/CreateUserByEmailForm";

interface ApartmentDetailContentProps {
  apartmentId: string;
  currentUser: UserResponse;
}

const ApartmentDetailContent: React.FC<ApartmentDetailContentProps> = ({
  apartmentId,
  currentUser,
}) => {
  const { data, isLoading, isError } = useGetApartmentByIdQuery(apartmentId);

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

      <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <Link
            href={`/apartment/report-issue?apartmentId=${apartmentId}`}
            passHref
          >
            <Button className="w-full bg-red-500 text-white sm:w-auto">
              Report Issue
            </Button>
          </Link>
        </div>

        {isOwner && (
          <div className="w-full sm:w-auto">
            <Link
              href={`/rentalcontracts/add?apartment_id=${apartmentId}`}
              passHref
            >
              <Button className="w-full bg-blue-500 text-white sm:w-auto">
                Add Rental Contract
              </Button>
            </Link>
          </div>
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
