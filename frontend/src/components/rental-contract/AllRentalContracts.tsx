"use client";

import React, { useEffect, useState } from "react";
import { useGetAllRentalContractsQuery } from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import Spinner from "@/components/shared/Spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationLocal from "@/components/shared/PaginationLocal";

const AllRentalContracts: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const urlStatus = searchParams.get("status");

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    urlStatus !== null ? urlStatus : undefined,
  );

  useEffect(() => {
    setSelectedStatus(urlStatus !== null ? urlStatus : undefined);
  }, [urlStatus]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value || undefined;
    setSelectedStatus(value);

    const newSearchParams = new URLSearchParams();
    if (value) {
      newSearchParams.set("status", value);
    }
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const { data, isLoading, isError } = useGetAllRentalContractsQuery({
    status: selectedStatus,
    page: currentPage,
  });

  const rentalContracts = data?.rental_contract.results;

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-center pt-32">
        <p className="h2-semibold dark:text-red-500">
          Failed to load rental contracts. Please try again later.
        </p>
      </div>
    );
  }

  const totalPages = rentalContracts
    ? Math.ceil(data?.rental_contract.count / 10)
    : 0;

  return (
    <div className="my-0 flex-col rounded-2xl bg-zinc-100 p-4 max-md:my-0 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-center">
        <Link href="/rentalcontracts/add">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full rounded-lg bg-zinc-800 text-white sm:w-64">
            Add New Contract
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Filter by Status
        </label>
        <select
          id="status"
          value={selectedStatus || ""}
          onChange={handleStatusChange}
          className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-700"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      <h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin mt-4 text-xl">
        Total: {data?.rental_contract.count}
      </h2>

      <div className="mb-4 mt-7 grid flex-1 grid-cols-1 gap-6 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {rentalContracts && data.rental_contract.count > 0 ? (
          rentalContracts.map((contract) => (
            <div
              key={contract.id}
              className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-md transition duration-200 
            hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Tenant: {contract.tenant}
                </h3>
              </div>

              <div className="mb-4 border-t border-gray-300 pt-4 dark:border-zinc-600">
                <h4 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Contract Details
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Start Date:</span>{" "}
                  {contract.start_date}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">End Date:</span>{" "}
                  {contract.end_date}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Rent Amount:</span>{" "}
                  {contract.rent_amount}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Deposit:</span>{" "}
                  {contract.deposit}
                </p>
              </div>

              {contract.apartment && (
                <div className="mb-4 border-t border-gray-300 pt-4 dark:border-zinc-600">
                  <h4 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Apartment Details
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Street:</span>{" "}
                    {contract.apartment.street}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Building Number:</span>{" "}
                    {contract.apartment.building_number || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Apartment Number:</span>{" "}
                    {contract.apartment.apartment_number || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">City:</span>{" "}
                    {contract.apartment.city}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Postal Code:</span>{" "}
                    {contract.apartment.postal_code || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Country:</span>{" "}
                    {contract.apartment.country}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Link href={`/rentalcontracts/${contract.id}`}>
                  <Button
                    className="border-primary bg-primary hover:bg-primary-dark focus:ring-primary-light w-full rounded-lg border px-6 
                 py-2  shadow-md transition 
                 duration-200 focus:ring-2 sm:w-auto"
                  >
                    View Contract
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="h2-semibold dark:text-lime-500">No contracts found!</p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
};

export default AllRentalContracts;
