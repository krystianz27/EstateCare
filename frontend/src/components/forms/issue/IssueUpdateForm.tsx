"use client";

import { useUpdateIssueMutation } from "@/lib/redux/features/issue/issueApiSlice";
import React, { useState } from "react";
import { IssueUpdateSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
// import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { statusOptions } from "@/constant";
import customStyles from "../selectStyles";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import UserAutocomplete from "@/components/shared/search/UserAutocomplete";

// const ClientOnly = dynamic<{ children: React.ReactNode }>(
//   () => Promise.resolve(({ children }) => <>{children}</>),
//   { ssr: false },
// );

interface UpdateParamsProps {
  params: {
    id: string;
  };
}

export default function IssueUpdateForm({ params }: UpdateParamsProps) {
  const issueId = params.id;
  const [updateIssue, { isLoading }] = useUpdateIssueMutation();
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IssueUpdateSchema>();

  const onSubmit = async (formValues: IssueUpdateSchema) => {
    if (!formValues.status && !selectedUser) {
      toast.error("You must update at least one field!");
      return;
    }

    const valuesWithIssueId = {
      ...formValues,
      issueId,
      assigned_to: selectedUser || undefined,
    };

    try {
      await updateIssue(valuesWithIssueId).unwrap();
      toast.success("The Issue has been updated successfully.");
      reset();
      setSelectedUser(null);
      // router.push("/profile");
      router.push(`/issue/${issueId}`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <main className="my-10 flex h-screen items-start justify-center bg-gray-100 dark:bg-gray-800">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="dark:text-whit w-full max-w-md rounded-3xl bg-slate-100 p-6 shadow-lg dark:bg-zinc-900"
      >
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Update Issue
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={statusOptions}
                value={statusOptions.find(
                  (option) => option.value === field.value,
                )}
                isClearable
                placeholder="Select status... (optional)"
                onChange={(selectedOption) =>
                  setValue("status", selectedOption?.value)
                }
                styles={customStyles}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Assign to</label>
          <UserAutocomplete
            onSelectUser={(username) => setSelectedUser(username)}
            placeholder="Search and select a user (optional)"
          />
          {selectedUser && (
            <div className="mt-2 flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-700">
              <span>{selectedUser}</span>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {errors.status && (
          <p className="mt-2 text-sm text-red-500">{errors.status.message}</p>
        )}

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-amber dark:text-amberText mt-4 w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Update Issue"}
        </Button>
      </form>
    </main>
  );
}
