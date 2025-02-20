"use client";
import { useCreateApartmentMutation } from "@/lib/redux/features/apartment/apartmentApiSlice";
import { apartmentSchema, ApartmentSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import {
  BuildingOfficeIcon,
  HomeIcon,
  MapIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ApartmentCreateForm() {
  const [createApartment, { isLoading }] = useCreateApartmentMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApartmentSchema>({
    resolver: zodResolver(apartmentSchema),
    mode: "all",
  });

  const onSubmit = async (values: ApartmentSchema) => {
    try {
      await createApartment(values).unwrap();
      toast.success("Apartment Added");
      router.push("/profile");
      reset();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || "An error occurred");
    }
  };

  return (
    <main>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <FormFieldComponent
          label="Street"
          name="street"
          register={register}
          errors={errors}
          placeholder="Street"
          startIcon={<MapIcon className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="Building Number"
          name="building_number"
          register={register}
          errors={errors}
          placeholder="Building Name"
          startIcon={
            <BuildingOfficeIcon className="dark:text-babyPowder size-8" />
          }
        />

        <FormFieldComponent
          label="Apartment Unit Number"
          name="apartment_number"
          register={register}
          errors={errors}
          placeholder="Apartment Number (optional)"
          startIcon={<HomeIcon className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="City"
          name="city"
          register={register}
          errors={errors}
          placeholder="City"
          startIcon={
            <BuildingLibraryIcon className="dark:text-babyPowder size-8" />
          }
        />

        <FormFieldComponent
          label="Postal Code"
          name="postal_code"
          register={register}
          errors={errors}
          placeholder="Postal Code"
          startIcon={<EnvelopeIcon className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="Country"
          name="country"
          register={register}
          errors={errors}
          placeholder="Country"
          startIcon={<GlobeAltIcon className="dark:text-babyPowder size-8" />}
        />

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : `Add Your Apartment`}
        </Button>
      </form>
    </main>
  );
}
