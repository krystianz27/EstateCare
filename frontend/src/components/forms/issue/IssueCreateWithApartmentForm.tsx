"use client";

import { useReportIssueMutation } from "@/lib/redux/features/issue/issueApiSlice";
import {
  issueCreateWithApartmentSchema,
  IssueCreateWithApartmentSchema,
} from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter, useSearchParams } from "next/navigation";

const IssueCreateWithApartment: React.FC = () => {
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get("apartmentId");
  const router = useRouter();

  const [reportIssue, { isLoading }] = useReportIssueMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IssueCreateWithApartmentSchema>({
    resolver: zodResolver(issueCreateWithApartmentSchema),
    mode: "all",
  });

  const onSubmit = async (formValues: IssueCreateWithApartmentSchema) => {
    try {
      const valuesToSend: ReportIssueData = {
        ...formValues,
        apartmentId: apartmentId as string,
        status: "reported",
      };

      await reportIssue(valuesToSend).unwrap();
      toast.success(
        "Your issue has been reported. A confirmation email has been sent to you.",
      );
      reset();
      router.push(`/apartment/${apartmentId}`);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || "An error occurred");
    }
  };

  if (!apartmentId) {
    return <p>Apartment ID not found in URL.</p>;
  }

  return (
    <main>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 dark:text-black"
      >
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
};

export default IssueCreateWithApartment;
