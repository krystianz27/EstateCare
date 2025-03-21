"use client";

import React from "react";
import {
  useGetRentalContractByIdQuery,
  useUpdateRentalContractMutation,
} from "@/lib/redux/features/rental-contract/rentalContractApiSlice";

import Spinner from "@/components/shared/Spinner";
import Link from "next/link";
import { toast } from "react-toastify";

interface RentalContractDetailProps {
  contractId: string;
}

const RentalContractDetail: React.FC<RentalContractDetailProps> = ({
  contractId,
}) => {
  const { data, isLoading, isError } =
    useGetRentalContractByIdQuery(contractId);

  const [updateRentalContract] = useUpdateRentalContractMutation();

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (isError || !data) {
    return <p>Error loading rental contract details.</p>;
  }

  const handleTerminateContract = async () => {
    try {
      await updateRentalContract({
        id: contractId,
        data: { status: "terminated" },
      }).unwrap();

      toast.success("Contract has been terminated.");
    } catch (error) {
      toast.error("An error occurred while terminating the contract.");
    }
  };

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
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-800">
      <h1 className="mb-8 text-center text-4xl font-bold dark:text-zinc-200">
        Rental Contract Details
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-gray-100 p-6 shadow-md dark:bg-zinc-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Owner & Tenant
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Owner:</strong> {rentalContract.owner.first_name}{" "}
            {rentalContract.owner.last_name}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Tenant:</strong> {rentalContract.tenant}
          </p>
        </div>

        <div className="rounded-xl bg-gray-100 p-6 shadow-md dark:bg-zinc-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Apartment Address
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{formatAddress()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-gray-100 p-6 shadow-md dark:bg-zinc-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Contract Details
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Start Date:</strong> {rentalContract.start_date}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>End Date:</strong> {rentalContract.end_date}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Rent Amount:</strong> {rentalContract.rent_amount}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Deposit:</strong> {rentalContract.deposit}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Status:</strong> {rentalContract.status}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-6 shadow-md dark:bg-zinc-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Contract Actions
          </h2>

          <Link href={`/rentalcontracts/edit/${contractId}`} className="w-full">
            <button className="mb-4 w-full rounded-full bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600">
              Edit Contract
            </button>
          </Link>

          <button
            onClick={handleTerminateContract}
            className="w-full rounded-full bg-red-500 px-4 py-2 text-white transition duration-200 hover:bg-red-600"
          >
            Terminate Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalContractDetail;
