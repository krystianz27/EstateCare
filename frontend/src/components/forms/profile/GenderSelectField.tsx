import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { ProfileSchema } from "@/lib/validation";
import { UserSearch } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import Select from "react-select";
import customStyles from "../selectStyles";

const ClientOnly = dynamic<{ children: React.ReactNode }>(
  () => Promise.resolve(({ children }) => <>{children}</>),
  { ssr: false },
);

type Gender = "male" | "female" | "other";

function isGender(value: unknown): value is Gender {
  return ["male", "female", "other"].includes(value as string);
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

interface GenderSelectFieldProps {
  setValue: UseFormSetValue<ProfileSchema>;
  control: Control<ProfileSchema>;
}

export default function GenderSelectField({
  setValue,
  control,
}: GenderSelectFieldProps) {
  const { data } = useGetUserProfileQuery();

  const profile = data?.profile;

  useEffect(() => {
    if (profile?.gender) {
      const genderValue = genderOptions.find(
        (option) => option.value === profile.gender,
      );

      if (genderValue && isGender(genderValue.value)) {
        setValue("gender", genderValue.value);
      }
    }
  }, [profile, setValue]);

  return (
    <div>
      <label htmlFor="gender" className="h4-semibold dark:text-babyPowder">
        Gender
      </label>
      <div className="mt-1 flex items-center space-x-3">
        <UserSearch className="size-8 dark:text-babyPowder" />
        <ClientOnly>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                className="mt-1 w-full"
                {...field}
                options={genderOptions}
                value={genderOptions.find(
                  (option) => option.value === field.value,
                )}
                onChange={(option) => field.onChange(option?.value)}
                instanceId="gender-select"
                styles={customStyles}
              />
            )}
          />
        </ClientOnly>
      </div>
    </div>
  );
}
