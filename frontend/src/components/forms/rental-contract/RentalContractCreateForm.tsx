"use client";

import {
  rentalContractCreateSchema,
  RentalContractCreateSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { useCreateRentalContractMutation } from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import { FormFieldComponent } from "../FormFieldComponent";
import { useGetAllMyApartmentsFullQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import dynamic from "next/dynamic";
import customStyles from "../selectStyles";
import Select from "react-select";

const ClientOnly = dynamic<{ children: React.ReactNode }>(
  () => Promise.resolve(({ children }) => <>{children}</>),
  { ssr: false },
);

export default function RentalContractCreateForm() {
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get("apartment_id") || undefined;
  const router = useRouter();

  const { data } = useGetAllMyApartmentsFullQuery({ page: 1 });
  const apartmentOptions =
    data?.apartment.results.map((apartment) => ({
      value: apartment.id,
      label: `${apartment.street} ${apartment.building_number || ""} 
        ${apartment.apartment_number ? `, ${apartment.apartment_number}` : ""}, ${apartment.city}`,
    })) || [];

  const [createRentalContract, { isLoading }] =
    useCreateRentalContractMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RentalContractCreateSchema>({
    resolver: zodResolver(rentalContractCreateSchema),
    mode: "all",
  });

  const onSubmit = async (formValues: RentalContractCreateSchema) => {
    try {
      const valuesToSend = {
        ...formValues,
        apartment_id: apartmentId,
      };

      await createRentalContract(valuesToSend).unwrap();
      toast.success("Your rental contract has been created.");
      reset();
      router.push("/profile");
    } catch (error) {
      toast.error("An error occurred while creating the rental contract.");
    }
  };

  return (
    <main className="flex justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 dark:text-black"
      >
        <div>
          <label
            htmlFor="apartment_id"
            className="h4-semibold dark:text-babyPowder"
          >
            Select Apartment
          </label>
          <div className="mt-1 flex items-center space-x-3 text-sm">
            <ClientOnly>
              <Controller
                name="apartment_id"
                control={control}
                defaultValue={apartmentId}
                render={({ field: { onChange, value } }) => (
                  <Select
                    className="mt-1 w-full"
                    options={apartmentOptions}
                    value={apartmentOptions.find(
                      (option) => option.value === value,
                    )}
                    onChange={(val) => onChange(val?.value || "")}
                    placeholder="Select your apartment"
                    instanceId="apartment-select"
                    styles={customStyles}
                  />
                )}
              />
            </ClientOnly>
          </div>
          {errors.apartment_id && (
            <p className="mt-2 text-sm text-red-500">
              {errors.apartment_id.message}
            </p>
          )}
        </div>
        <FormFieldComponent
          label="Tenant"
          name="tenant"
          register={register}
          errors={errors}
          placeholder="Tenant Name"
        />

        <FormFieldComponent
          label="Start Date"
          name="start_date"
          register={register}
          errors={errors}
          placeholder="Start Date"
          type="date"
        />

        <FormFieldComponent
          label="End Date"
          name="end_date"
          register={register}
          errors={errors}
          placeholder="End Date"
          type="date"
        />

        <FormFieldComponent
          label="Rent Amount"
          name="rent_amount"
          register={register}
          errors={errors}
          placeholder="Rent Amount"
        />

        <FormFieldComponent
          label="Deposit"
          name="deposit"
          register={register}
          errors={errors}
          placeholder="Deposit Amount"
        />

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Create Contract"}
        </Button>
      </form>
    </main>
  );
}
