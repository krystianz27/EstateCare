"use client";

import {
  rentalContractCreateSchema,
  RentalContractCreateSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { useCreateRentalContractMutation } from "@/lib/redux/features/rental-contract/rentalContractApiSlice";
import { FormFieldComponent } from "../FormFieldComponent"; // Import FormFieldComponent

export default function RentalContractCreateForm() {
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get("apartment_id") || undefined;
  const router = useRouter();

  const [createRentalContract, { isLoading }] =
    useCreateRentalContractMutation();

  const {
    register,
    handleSubmit,
    reset,
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
