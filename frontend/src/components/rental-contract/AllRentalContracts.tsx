"use client";

import React from "react";
import { useGetAllRentalContractsQuery } from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import Spinner from "@/components/shared/Spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import PaginationLocal from "@/components/shared/PaginationLocal";

const AllRentalContracts: React.FC = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useGetAllRentalContractsQuery({
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
    <div className="my-4 flex-col rounded-2xl bg-zinc-100 p-4 max-md:my-4 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-center">
        <Link href="/rentalcontracts/add">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full rounded-lg bg-zinc-800 text-white sm:w-64">
            Add New Contract
          </Button>
        </Link>
      </div>

      <h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin mt-4 text-xl">
        Total: {data?.rental_contract.count}
      </h2>

      <div className="mb-4 mt-7 grid flex-1 grid-cols-1 gap-6 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {rentalContracts && data.rental_contract.count > 0 ? (
          rentalContracts.map((contract) => (
            <div
              key={contract.id}
              className="mb-4 rounded-lg border bg-white p-6 shadow-sm transition duration-200 
                  hover:bg-stone-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <h3 className="text-xl font-semibold">{contract.tenant}</h3>
              <p>Start Date: {contract.start_date}</p>
              <p>End Date: {contract.end_date}</p>
              <p>Rent Amount: {contract.rent_amount}</p>
              <p>Deposit: {contract.deposit}</p>

              {contract.apartment && (
                <div className="mt-4">
                  <h4 className="font-semibold">Apartment Details:</h4>
                  <p>Street: {contract.apartment.street}</p>
                  <p>
                    {contract.apartment.building_number
                      ? `Building Number: ${contract.apartment.building_number}`
                      : "Building Number: N/A"}
                  </p>
                  <p>
                    {contract.apartment.apartment_number
                      ? `Apartment Number: ${contract.apartment.apartment_number}`
                      : "Apartment Number: N/A"}
                  </p>
                  <p>City: {contract.apartment.city}</p>
                  <p>
                    {contract.apartment.postal_code
                      ? `Postal Code: ${contract.apartment.postal_code}`
                      : "Postal Code: N/A"}
                  </p>
                  <p>Country: {contract.apartment.country}</p>
                </div>
              )}

              <div className="mt-4 flex justify-center">
                <Link href={`/rentalcontracts/${contract.id}`}>
                  <Button className="w-full sm:w-auto">View Contract</Button>
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
