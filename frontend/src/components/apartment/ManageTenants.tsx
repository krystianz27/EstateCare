import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import UserAutocomplete from "../shared/search/UserAutocomplete";
import { useUpdateTenantsMutation } from "@/lib/redux/features/apartment/apartmentApiSlice";

interface ManageTenantsProps {
  apartmentId: string;
}

const ManageTenants: React.FC<ManageTenantsProps> = ({ apartmentId }) => {
  const [tenantIdsToAdd, setTenantIdsToAdd] = useState<string[]>([]);
  const [tenantIdsToRemove, setTenantIdsToRemove] = useState<string[]>([]);

  const [
    updateTenants,
    { isLoading: isUpdating, isSuccess, isError: isUpdatingError, error },
  ] = useUpdateTenantsMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Tenants updated successfully!");
      setTenantIdsToAdd([]);
      setTenantIdsToRemove([]);
    }

    if (isUpdatingError) {
      // const errorMessage =
      //   error && "data" in error
      //     ? JSON.stringify((error as any).data.apartment)
      //     : "Unknown error occurred";
      // toast.error("Failed to update tenants: " + errorMessage);
      toast.error("Failed to update tenants. Please try again later");
    }
  }, [isSuccess, isUpdatingError, error]);

  const handleAddTenant = () => {
    if (tenantIdsToAdd.length > 0) {
      updateTenants({ id: apartmentId, tenantData: { add: tenantIdsToAdd } });
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

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold">Manage Tenants</h3>

      <div className="mt-4">
        <h4 className="text-lg font-medium">Add Tenants</h4>
        <UserAutocomplete
          onSelectUser={(username) =>
            setTenantIdsToAdd([...tenantIdsToAdd, username])
          }
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
          className="bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
        >
          Click to Add Selected Tenants
        </Button>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium">Remove Tenants</h4>
        <UserAutocomplete
          onSelectUser={(username) =>
            setTenantIdsToRemove([...tenantIdsToRemove, username])
          }
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
          className="bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
        >
          Click to Remove Selected Tenants
        </Button>
      </div>
    </section>
  );
};

export default ManageTenants;
