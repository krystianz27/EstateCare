"use client";

import React, { useEffect, useState } from "react";
import {
  useGetApartmentByIdQuery,
  useUpdateTenantsMutation,
} from "@/lib/redux/features/apartment/apartmentApiSlice";
import { Button } from "../ui/button";
import Spinner from "../shared/Spinner";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import UserAutocomplete from "../shared/search/UserAutocomplete";

interface ApartmentDetailContentProps {
  apartmentId: string;
}

const ApartmentDetailContent: React.FC<ApartmentDetailContentProps> = ({
  apartmentId,
}) => {
  const { data, isLoading, isError } = useGetApartmentByIdQuery(apartmentId);
  const [
    updateTenants,
    { isLoading: isUpdating, isSuccess, isError: isUpdatingError, error },
  ] = useUpdateTenantsMutation();

  const [tenantIdsToAdd, setTenantIdsToAdd] = useState<string[]>([]);
  const [tenantIdsToRemove, setTenantIdsToRemove] = useState<string[]>([]);

  const router = useRouter();

  const handleAddTenant = () => {
    if (tenantIdsToAdd.length > 0) {
      updateTenants({
        id: apartmentId,
        tenantData: { add: tenantIdsToAdd },
      });
    }
  };

  const handleRemoveTenant = () => {
    if (tenantIdsToRemove.length > 0) {
      updateTenants({
        id: apartmentId,
        tenantData: { remove: tenantIdsToRemove },
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Tenants updated successfully!");
      setTenantIdsToAdd([]);
      setTenantIdsToRemove([]);
    }

    if (isUpdatingError) {
      const errorMessage =
        error && "data" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            JSON.stringify((error as any).data.apartment)
          : "Unknown error occurred";
      toast.error("Failed to update tenants: " + errorMessage);
    }
  }, [isSuccess, isUpdatingError, error]);

  const handleReportIssue = () => {
    router.push("/issue/report-issue");
  };

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (isError || !data) {
    return <p>Error loading apartment details.</p>;
  }

  const apartment = data.apartment;

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

  const handleSelectUserToAdd = (username: string) => {
    if (!tenantIdsToAdd.includes(username)) {
      setTenantIdsToAdd([...tenantIdsToAdd, username]);
    }
  };

  const handleSelectUserToRemove = (username: string) => {
    if (!tenantIdsToRemove.includes(username)) {
      setTenantIdsToRemove([...tenantIdsToRemove, username]);
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

      <section className="mb-8">
        <h3 className="text-xl font-semibold">Tenants</h3>
        <ul className="mt-2">
          {apartment.tenants?.length > 0 ? (
            apartment.tenants.map((tenant) => (
              <li key={tenant.id} className="text-gray-700">
                {tenant.first_name} {tenant.last_name}
              </li>
            ))
          ) : (
            <p>No tenants assigned.</p>
          )}
        </ul>
      </section>

      <section className="mb-8">
        <Button onClick={handleReportIssue} className="bg-red-500 text-white">
          Report Issue
        </Button>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Manage Tenants</h3>

        <div className="mt-4">
          <h4 className="text-lg font-medium">Add Tenants</h4>
          <UserAutocomplete
            onSelectUser={handleSelectUserToAdd}
            placeholder="Enter username or email"
          />
          <div className="mt-2">
            {tenantIdsToAdd.map((username) => (
              <div
                key={username}
                className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-800"
              >
                <span>{username}</span>
                <button
                  onClick={() =>
                    setTenantIdsToAdd(
                      tenantIdsToAdd.filter((id) => id !== username),
                    )
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleAddTenant}
            disabled={tenantIdsToAdd.length === 0}
            className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          >
            Click to Add Selected Tenants
          </Button>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium">Remove Tenants</h4>
          <UserAutocomplete
            onSelectUser={handleSelectUserToRemove}
            placeholder="Enter username or email"
          />
          <div className="mt-2">
            {tenantIdsToRemove.map((username) => (
              <div
                key={username}
                className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-800"
              >
                <span>{username}</span>
                <button
                  onClick={() =>
                    setTenantIdsToRemove(
                      tenantIdsToRemove.filter((id) => id !== username),
                    )
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleRemoveTenant}
            disabled={tenantIdsToRemove.length === 0}
            className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          >
            Click to Remove Selected Tenants
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ApartmentDetailContent;
