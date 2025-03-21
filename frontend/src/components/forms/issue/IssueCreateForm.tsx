"use client";

import { useGetAllMyApartmentsFullQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import { useReportIssueMutation } from "@/lib/redux/features/issue/issueApiSlice";
import { issueCreateSchema, IssueCreateSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { FlagIcon } from "lucide-react";
import Select from "react-select";
import { priorityOptions } from "@/constant";
import customStyles from "../selectStyles";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { ReportIssueData } from "@/types";

const ClientOnly = dynamic<{ children: React.ReactNode }>(
  () => Promise.resolve(({ children }) => <>{children}</>),
  { ssr: false },
);

export default function IssueCreateForm() {
  const { data } = useGetAllMyApartmentsFullQuery({ page: 1 });
  const apartmentOptions =
    data?.apartment.results.map((apartment) => ({
      value: apartment.id,
      label: `${apartment.street} ${apartment.building_number || ""} 
          ${apartment.apartment_number ? `, ${apartment.apartment_number}` : ""}, ${apartment.city}`,
    })) || [];

  const [reportIssue, { isLoading }] = useReportIssueMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IssueCreateSchema>({
    resolver: zodResolver(issueCreateSchema),
    mode: "all",
  });

  const onSubmit = async (formValues: IssueCreateSchema) => {
    try {
      const valuesToSend: ReportIssueData = {
        ...formValues,
        status: "reported",
      };

      await reportIssue(valuesToSend).unwrap();
      toast.success(
        "Your issue has been reported. A confirmation email has been sent to you.",
      );
      reset();
      router.push("/profile");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || "An error occurred");
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
            htmlFor="apartmentId"
            className="h4-semibold dark:text-babyPowder"
          >
            Select Apartment
          </label>
          <div className="mt-1 flex items-center space-x-3 text-sm">
            <ClientOnly>
              <Controller
                name="apartmentId"
                control={control}
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
          {errors.apartmentId && (
            <p className="mt-2 text-sm text-red-500">
              {errors.apartmentId.message}
            </p>
          )}
        </div>

        <FormFieldComponent
          label="Title"
          name="title"
          register={register}
          errors={errors}
          placeholder="Issue Title"
        />
        <FormFieldComponent
          label="Description"
          name="description"
          register={register}
          errors={errors}
          placeholder="Detailed Description of the issue"
          isTextArea
          startIcon={<FlagIcon className="dark:text-babyPowder size-8" />}
        />
        <div>
          <label
            htmlFor="priority"
            className="h4-semibold dark:text-babyPowder"
          >
            Priority
          </label>
          <div className="mt-1 flex items-center space-x-3 text-sm">
            <ClientOnly>
              <Controller
                name="priority"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    className="mt-1 w-full"
                    options={priorityOptions}
                    value={priorityOptions.find(
                      (option) => option.value === value,
                    )}
                    onChange={(val) => onChange(val?.value)}
                    onBlur={onBlur}
                    placeholder="What priority is your issue?"
                    instanceId="priority-select"
                    styles={customStyles}
                  />
                )}
              />
            </ClientOnly>
          </div>
          {errors.priority && (
            <p className="mt-2 text-sm text-red-500">
              {errors.priority.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText mt-2 w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Report"}
        </Button>
      </form>
    </main>
  );
}
