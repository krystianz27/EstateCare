"use client";

import React from "react";
import { useGetRentalContractByIdQuery } from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import Spinner from "@/components/shared/Spinner";

interface RentalContractDetailProps {
  contractId: string;
}

const RentalContractDetail: React.FC<RentalContractDetailProps> = ({
  contractId,
}) => {
  const { data, isLoading, isError } =
    useGetRentalContractByIdQuery(contractId);

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (isError || !data) {
    return <p>Error loading rental contract details.</p>;
  }

  const rentalContract = data.rental_contract;

  const formatAddress = () => {
    if (!rentalContract.apartment) return "No address available";

    let address = `${rentalContract.apartment.street}, `;
    if (rentalContract.apartment.building_number) {
      address += `Building ${rentalContract.apartment.building_number}, `;
    }

    if (rentalContract.apartment.apartment_number) {
      address += `Unit ${rentalContract.apartment.apartment_number}, `;
    }

    address += `${rentalContract.apartment.city}, ${rentalContract.apartment.postal_code}, ${rentalContract.apartment.country}`;
    return address;
  };

  return (
    <div className="container mx-auto rounded-2xl bg-slate-100 px-4 py-8 max-md:my-2 dark:bg-zinc-900">
      <section className="mb-8">
        <h1 className="text-center text-3xl font-semibold">
          Rental Contract Details
        </h1>
        <div className="mt-2 text-gray-700">
          <p>
            <strong>Owner:</strong> {rentalContract.owner.first_name}{" "}
            {rentalContract.owner.last_name}
          </p>
          <p>
            <strong>Tenant:</strong> {rentalContract.tenant}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold">Apartment Address</h2>
        <p>{formatAddress()}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold">Contract Details</h2>
        <p>
          <strong>Start Date:</strong> {rentalContract.start_date}
        </p>
        <p>
          <strong>End Date:</strong> {rentalContract.end_date}
        </p>
        <p>
          <strong>Rent Amount:</strong> {rentalContract.rent_amount}
        </p>
        <p>
          <strong>Deposit:</strong> {rentalContract.deposit}
        </p>
        <p>
          <strong>Status:</strong> {rentalContract.status}
        </p>
      </section>
    </div>
  );
};

export default RentalContractDetail;
