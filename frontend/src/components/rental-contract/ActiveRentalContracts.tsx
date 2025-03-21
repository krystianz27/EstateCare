import React from "react";
import { useGetAllRentalContractsQuery } from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import Spinner from "@/components/shared/Spinner";
import Link from "next/link";

interface ActiveRentalContractsProps {
  apartmentId?: string;
}

const ActiveRentalContracts: React.FC<ActiveRentalContractsProps> = ({
  apartmentId,
}) => {
  const { data, isLoading, isError } = useGetAllRentalContractsQuery({
    apartment_id: apartmentId,
    status: "active",
  });

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (isError || !data) {
    return <p>Error loading active rental contracts.</p>;
  }

  const rentalContracts = data.rental_contract.results;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Active Rental Contracts</h2>

      {rentalContracts.length === 0 ? (
        <p>No active rental contracts found.</p>
      ) : (
        <ul className="space-y-6 p-2">
          {rentalContracts.map((contract) => (
            <Link key={contract.id} href={`/rentalcontracts/${contract.id}`}>
              <li className="mb-4 rounded-lg border bg-white p-6 shadow-sm transition duration-200 hover:bg-stone-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <h3 className="text-xl font-semibold">{contract.tenant}</h3>
                <p>Start Date: {contract.status}</p>
                <p>Start Date: {contract.start_date}</p>
                <p>End Date: {contract.end_date}</p>
                <p>Rent Amount: {contract.rent_amount}</p>
                <p>Deposit: {contract.deposit}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveRentalContracts;
