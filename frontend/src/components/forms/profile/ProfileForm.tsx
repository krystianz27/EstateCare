import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "@/lib/redux/features/users/usersApiSlice";
import { ProfileSchema } from "@/lib/validation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FormFieldComponent } from "../FormFieldComponent";
import GenderSelectField from "./GenderSelectField";
import OccupationSelectField from "./OccupationSelectField";
import { useEffect } from "react";
import { Profile } from "@/types";
import Spinner from "@/components/shared/Spinner";

interface ProfileFormProps {
  profile?: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileSchema>();

  useEffect(() => {
    if (profile) {
      const {
        first_name,
        last_name,
        username,
        gender,
        bio,
        country_of_origin,
        city_of_origin,
        occupations,
        phone_number,
      } = profile;
      reset({
        first_name,
        last_name,
        username,
        gender,
        bio,
        country_of_origin,
        city_of_origin,
        occupations_input:
          occupations?.map((occupation) => occupation.name) || [],
        phone_number,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileSchema) => {
    try {
      const updatedValues = {
        ...values,
        occupations_input: values.occupations_input?.join(", ") || "",
      };
      await updateUserProfile(updatedValues).unwrap();
      toast.success("Update Successful");
    } catch (error) {
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4"
    >
      <FormFieldComponent
        label="Username"
        name="username"
        register={register}
        errors={errors}
        placeholder="Username"
      />
      <FormFieldComponent
        label="First Name"
        name="first_name"
        register={register}
        errors={errors}
        placeholder="First Name"
      />
      <FormFieldComponent
        label="Last Name"
        name="last_name"
        register={register}
        errors={errors}
        placeholder="Last Name"
      />
      <FormFieldComponent
        label="Phone Number"
        name="phone_number"
        register={register}
        errors={errors}
        placeholder="Phone Number"
      />
      <GenderSelectField setValue={setValue} control={control} />

      <OccupationSelectField setValue={setValue} control={control} />

      <FormFieldComponent
        label="Country"
        name="country_of_origin"
        register={register}
        errors={errors}
        placeholder="What's your country"
      />
      <FormFieldComponent
        label="City"
        name="city_of_origin"
        register={register}
        errors={errors}
        placeholder="City"
      />
      <FormFieldComponent
        label="Bio"
        name="bio"
        register={register}
        errors={errors}
        placeholder="Bio"
        isTextArea
      />
      <Button
        type="submit"
        className="h4-semibold bg-eerieBlack dark:bg-amber dark:text-amberText mt-2 w-full text-white dark:hover:bg-amberHover"
        disabled={isUpdating}
      >
        {isUpdating ? <Spinner size="sm" /> : "Update Profile"}
      </Button>
    </form>
  );
}
