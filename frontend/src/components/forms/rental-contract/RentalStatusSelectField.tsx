import { Control, Controller } from "react-hook-form";
import Select from "react-select";
import customStyles from "../selectStyles";
import React from "react";
import { RentalContractUpdateSchema } from "@/lib/validation"; // Importuj odpowiedni typ

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "terminated", label: "Terminated" },
];

interface RentalStatusSelectFieldProps {
  control: Control<RentalContractUpdateSchema>;
}

export default function RentalStatusSelectField({
  control,
}: RentalStatusSelectFieldProps) {
  return (
    <div>
      <label htmlFor="status" className="h4-semibold dark:text-babyPowder">
        Status
      </label>
      <div className="mt-1 flex items-center space-x-3">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              className="mt-1 w-full"
              {...field}
              options={statusOptions}
              value={statusOptions.find(
                (option) => option.value === field.value,
              )}
              onChange={(option) => field.onChange(option?.value)}
              instanceId="status-select"
              styles={customStyles}
            />
          )}
        />
      </div>
    </div>
  );
}
