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

  return (
    <div className="container mx-auto bg-slate-100 px-4 py-8 dark:bg-zinc-900">
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
          <input
            type="text"
            placeholder="Enter tenant's username or email"
            value={tenantIdsToAdd.join(", ")}
            onChange={(e) =>
              setTenantIdsToAdd(
                e.target.value.split(",").map((id) => id.trim()),
              )
            }
            className="mt-2 w-full rounded-md border p-2"
          />
          <Button
            onClick={handleAddTenant}
            disabled={tenantIdsToAdd.length === 0}
            className="mt-2"
          >
            Add Tenants
          </Button>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium">Remove Tenants</h4>
          <input
            type="text"
            placeholder="Enter tenant's username or email"
            value={tenantIdsToRemove.join(", ")}
            onChange={(e) =>
              setTenantIdsToRemove(
                e.target.value.split(",").map((id) => id.trim()),
              )
            }
            className="mt-2 w-full rounded-md border p-2"
          />
          <Button
            onClick={handleRemoveTenant}
            disabled={tenantIdsToRemove.length === 0}
            className="mt-2"
          >
            Remove Tenants
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ApartmentDetailContent;
