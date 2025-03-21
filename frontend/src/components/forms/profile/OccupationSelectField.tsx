import { occupationOptions } from "@/constant";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { ProfileSchema } from "@/lib/validation";
import { Briefcase } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import Select from "react-select";
import customStyles from "../selectStyles";

const ClientOnly = dynamic<{ children: React.ReactNode }>(
  () => Promise.resolve(({ children }) => <>{children}</>),
  { ssr: false },
);

interface OccupationSelectFieldProps {
  setValue: UseFormSetValue<ProfileSchema>;
  control: Control<ProfileSchema>;
}

export default function OccupationSelectField({
  setValue,
  control,
}: OccupationSelectFieldProps) {
  const { data } = useGetUserProfileQuery();
  const profile = data?.profile;

  useEffect(() => {
    if (profile?.occupations) {
      const occupations = profile.occupations.map(
        (occupation) => occupation.name,
      );
      setValue("occupations_input", occupations);
    }
  }, [profile, setValue]);

  return (
    <div>
      <label
        htmlFor="occupations_input"
        className="h4-semibold dark:text-babyPowder"
      >
        Occupation
      </label>
      <div className="mt-1 flex items-center space-x-3">
        <Briefcase className="dark:text-babyPowder size-8" />
        <ClientOnly>
          <Controller
            control={control}
            name="occupations_input"
            render={({ field }) => (
              <Select
                isMulti
                className="mt-1 w-full"
                {...field}
                options={occupationOptions}
                value={occupationOptions.filter((option) =>
                  field.value?.includes(option.value),
                )}
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions.map(
                    (option) => option.value,
                  );
                  setValue("occupations_input", selectedValues);
                }}
                instanceId="occupation-select"
                styles={customStyles}
              />
            )}
          />
        </ClientOnly>
      </div>
    </div>
  );
}
