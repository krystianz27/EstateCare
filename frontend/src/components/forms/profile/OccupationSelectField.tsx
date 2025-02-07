import { occupationOptions } from "@/constant";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { ProfileSchema } from "@/lib/validation";
import { Occupation } from "@/types";
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

function isOccupation(value: unknown): value is Occupation {
  return [
    "mason",
    "carpenter",
    "plumber",
    "roofer",
    "painter",
    "electrician",
    "gardener",
    "hvac",
    "tenant",
  ].includes(value as string);
}

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
    if (profile?.occupation) {
      const occupationValue = occupationOptions.find(
        (option) => option.value === profile.occupation,
      );

      if (occupationValue && isOccupation(occupationValue.value)) {
        setValue("occupation", occupationValue.value);
      }
    }
  }, [profile, setValue]);

  return (
    <div>
      <label htmlFor="occupation" className="h4-semibold dark:text-babyPowder">
        Occupation
      </label>
      <div className="mt-1 flex items-center space-x-3">
        <Briefcase className="size-8 dark:text-babyPowder" />
        <ClientOnly>
          <Controller
            control={control}
            name="occupation"
            render={({ field }) => (
              <Select
                className="mt-1 w-full"
                {...field}
                options={occupationOptions}
                value={occupationOptions.find(
                  (option) => option.value === field.value,
                )}
                onChange={(option) => field.onChange(option?.value)}
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
