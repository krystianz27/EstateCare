/* eslint-disable no-unused-vars */
"use client";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/lib/redux/features/users/usersApiSlice";
import { ProfileSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { Contact2Icon, Map, MapPinnedIcon, UserCheck2 } from "lucide-react";
import GenderSelectField from "./GenderSelectField";
import OccupationSelectField from "./OccupationSelectField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

export default function EditProfileForm() {
  const { data, isLoading: isProfileLoading } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const router = useRouter();

  const profile = data?.profile;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatar, setAvatar] = useState<{ message: string } | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.patch(
        "/api/v1/profiles/user/avatar/",
        formData,
        config,
      );
      setAvatar(data);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProfileSchema) => {
    try {
      const updatedValues = {
        ...values,
        occupations_input: values.occupations_input?.join(", ") || "",
      };
      await updateUserProfile(updatedValues).unwrap();
      toast.success("Update Successful");
      router.push("/profile");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || "An error occurred while updating profile");
    }
  };

  if (isProfileLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <main>
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
          startIcon={<UserCheck2 className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="First Name"
          name="first_name"
          register={register}
          errors={errors}
          placeholder="First Name"
          startIcon={<Contact2Icon className="dark:text-babyPowder size-8" />}
        />
        <FormFieldComponent
          label="Last Name"
          name="last_name"
          register={register}
          errors={errors}
          placeholder="Last Name"
          startIcon={<Contact2Icon className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="Phone Number"
          name="phone_number"
          register={register}
          errors={errors}
          placeholder="Phone Number"
          startIcon={<Contact2Icon className="dark:text-babyPowder size-8" />}
        />

        <GenderSelectField setValue={setValue} control={control} />

        <OccupationSelectField setValue={setValue} control={control} />

        <FormFieldComponent
          label="Country"
          name="country_of_origin"
          register={register}
          errors={errors}
          placeholder="What's your country"
          startIcon={<Map className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="City"
          name="city_of_origin"
          register={register}
          errors={errors}
          placeholder="City"
          startIcon={<MapPinnedIcon className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="Bio"
          name="bio"
          register={register}
          errors={errors}
          placeholder="Bio"
          isTextArea
        />

        <Label className="h4-semibold dark:text-babyPowder" htmlFor="avatar">
          Avatar
        </Label>

        <div className="flex w-full cursor-pointer items-center">
          <div className="grow" style={{ maxWidth: "90%" }}>
            <Input
              accept="image/*"
              className="file:bg-eerieBlack dark:border-platinum dark:text-platinum cursor-pointer file:mr-3 file:rounded-md file:text-lime-500"
              id="avatar"
              name="avatar"
              type="file"
              onChange={uploadFileHandler}
            />
          </div>

          {uploading && (
            <div className="shrink-0" style={{ width: "10%" }}>
              <Spinner size="sm" />
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText mt-2 w-full text-white"
          disabled={isUpdating || uploading}
        >
          {isUpdating || uploading ? <Spinner size="sm" /> : "Update Profile"}
        </Button>
      </form>
      <div className="mt-4 p-2 text-center">
        <Link href="/profile" className="inline-flex max-w-max">
          <Button
            type="button"
            className="w-full bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
          >
            Return to Profile
          </Button>
        </Link>
      </div>
    </main>
  );
}
