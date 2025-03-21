"use client";

import {
  rentalContractUpdateSchema,
  RentalContractUpdateSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import {
  useGetRentalContractByIdQuery,
  useUpdateRentalContractMutation,
} from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import { FormFieldComponent } from "../FormFieldComponent";
import RentalStatusSelectField from "./RentalStatusSelectField";

interface RentalContractUpdateFormProps {
  contractId: string;
}

export default function RentalContractUpdateForm({
  contractId,
}: RentalContractUpdateFormProps) {
  const router = useRouter();

  const {
    data: rentalContract,
    isLoading,
    isError,
  } = useGetRentalContractByIdQuery(contractId, {
    skip: !contractId,
  });

  const [updateRentalContract, { isLoading: isUpdating }] =
    useUpdateRentalContractMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RentalContractUpdateSchema>({
    resolver: zodResolver(rentalContractUpdateSchema),
    mode: "all",
  });

  useEffect(() => {
    if (rentalContract) {
      reset({
        tenant: rentalContract.rental_contract.tenant,
        start_date: rentalContract.rental_contract.start_date,
        end_date: rentalContract.rental_contract.end_date,
        rent_amount: rentalContract.rental_contract.rent_amount,
        deposit: rentalContract.rental_contract.deposit,
        status: rentalContract.rental_contract.status,
      });
    }
  }, [rentalContract, reset]);

  const onSubmit = async (formValues: RentalContractUpdateSchema) => {
    if (!contractId) {
      toast.error("Contract ID is missing.");
      return;
    }

    if (formValues.rent_amount === "" || formValues.rent_amount === undefined) {
      delete formValues.rent_amount;
    }

    if (formValues.deposit === "" || formValues.deposit === undefined) {
      delete formValues.deposit;
    }

    try {
      await updateRentalContract({
        id: contractId,
        data: formValues,
      }).unwrap();
      toast.success("Your rental contract has been updated.");
      router.push(`/rentalcontracts/${contractId}`);
    } catch (error) {
      toast.error("An error occurred while updating the rental contract.");
    }
  };

  if (isLoading || !rentalContract) {
    return <Spinner size="xl" />;
  }

  if (isError) {
    return <p>Error loading the rental contract data.</p>;
  }

  return (
    <main className="flex justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 dark:text-black"
      >
        <FormFieldComponent
          label="Tenant"
          name="tenant"
          register={register}
          errors={errors}
          placeholder="Tenant Name"
        />

        <FormFieldComponent
          label="Start Date (YYYY-MM-DD)"
          name="start_date"
          register={register}
          errors={errors}
          placeholder="Start Date"
        />

        <FormFieldComponent
          label="End Date (YYYY-MM-DD)"
          name="end_date"
          register={register}
          errors={errors}
          placeholder="End Date"
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

        <RentalStatusSelectField control={control} />

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          disabled={isUpdating}
        >
          {isUpdating ? <Spinner size="sm" /> : "Update Contract"}
        </Button>
      </form>
    </main>
  );
}
