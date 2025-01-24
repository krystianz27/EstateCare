"use client";

import { useAddRatingMutation } from "@/lib/redux/features/rating/ratingApiSlice";
import {
  technicianRatingCreateSchema,
  TechnicianRatingCreateSchema,
} from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

export default function RatingCreateForm() {
  const router = useRouter();

  const [addRating, { isLoading }] = useAddRatingMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TechnicianRatingCreateSchema>({
    resolver: zodResolver(technicianRatingCreateSchema),
    mode: "all",
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const ratedUser = queryParams.get("username");

    if (ratedUser) {
      setValue("rated_user_username", ratedUser);
      setUsername(ratedUser);
    }
  }, [setValue]);

  const onSubmit = async (data: TechnicianRatingCreateSchema) => {
    try {
      await addRating(data).unwrap();
      toast.success("Your Rating has been added!");
      router.push("/technicians");
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
          label=""
          name="rated_user_username"
          register={register}
          errors={errors}
          startIcon={<UserCog className="dark:text-babyPowder size-8" />}
          disabled
        />

        <label htmlFor="rating" className="h4-semibold dark:text-babyPowder">
          Rating
        </label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="rating"
              type="number"
              placeholder="Choose a value of between 1 and 5"
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        />
        {/* 
        {errors.rating && (
          <p className="mt-2 text-sm text-red-500">{errors.rating.message}</p>
        )} */}

        <FormFieldComponent
          label="Comment"
          name="comment"
          errors={errors}
          register={register}
          placeholder="Tell us why you have given the rating, it will help us improve service delivery"
          isTextArea
        />

        <Button
          type="submit"
          className={`h4-semibold bg-eerieBlack dark:bg-pumpkin w-full text-white ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Add Rating"}
        </Button>
      </form>
    </main>
  );
}
