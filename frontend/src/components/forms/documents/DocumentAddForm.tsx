"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import {
  documentCreateSchema,
  DocumentCreateSchema,
} from "@/lib/validation/documentSchema";
import { useCreateDocumentMutation } from "@/lib/redux/features/document/documentApiSlice";
import { useGetMyApartmentQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import Select from "react-select";
import customStyles from "../selectStyles";

const ClientOnly = dynamic<{ children: React.ReactNode }>( // Zastosowanie dynamicznego importu
  () => Promise.resolve(({ children }) => <>{children}</>),
  { ssr: false },
);

export default function DocumentAddForm() {
  const router = useRouter();
  const [createDocument, { isLoading }] = useCreateDocumentMutation();

  const { data: apartmentData } = useGetMyApartmentQuery();
  const apartmentOptions =
    apartmentData?.apartments.results.map((apartment) => ({
      value: apartment.id,
      label: `${apartment.unit_number}, ${apartment.building}, Floor ${apartment.floor}`,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DocumentCreateSchema>({
    resolver: zodResolver(documentCreateSchema),
    mode: "all",
  });

  const onSubmit = async (formValues: DocumentCreateSchema) => {
    try {
      if (!formValues.file) {
        toast.error("File is required.");
        return;
      }

      const processedValues = {
        ...formValues,
        file: formValues.file,
      };

      await createDocument(processedValues).unwrap();
      toast.success("Document created successfully.");
      reset();
      router.push("/documents");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error?.data?.detail || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const resetApartmentSelection = () => {
    setValue("apartment_uuid", undefined);
  };

  return (
    <main className="mx-auto max-w-md p-4">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormFieldComponent
          label="Title"
          name="title"
          register={register}
          errors={errors}
          placeholder="Enter document title"
          required
        />

        <div>
          <label
            htmlFor="apartmentId"
            className="h4-semibold dark:text-babyPowder"
          >
            Select Apartment
          </label>
          <div className="mt-1">
            <ClientOnly>
              <Controller
                name="apartment_uuid"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
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
                    <button
                      type="button"
                      onClick={resetApartmentSelection}
                      className="ml-2 text-sm text-red-500"
                    >
                      Clear Selection
                    </button>
                  </>
                )}
              />
            </ClientOnly>
          </div>
          {errors.apartment_uuid && (
            <p className="mt-2 text-sm text-red-500">
              {errors.apartment_uuid.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="file" className="h4-semibold dark:text-babyPowder">
            Upload Document
          </label>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                onChange={(e) => field.onChange(e.target.files?.[0])}
                className="mt-1 w-full"
              />
            )}
          />
          {errors.file && (
            <p className="mt-2 text-sm text-red-500">{errors.file.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="dark:bg-amber dark:text-amberText w-full bg-black text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Create Document"}
        </Button>
      </form>

      <div></div>
    </main>
  );
}
