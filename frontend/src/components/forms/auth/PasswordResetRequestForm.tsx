"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordRequestMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useForm } from "react-hook-form";
import {
  passwordResetRequestSchema,
  PasswordResetRequestSchema,
} from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { FormFieldComponent } from "@/components/forms/FormFieldComponent";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

export default function PasswordResetRequestForm() {
  const [resetPasswordRequest, { isLoading }] =
    useResetPasswordRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordResetRequestSchema>({
    resolver: zodResolver(passwordResetRequestSchema),
    mode: "all",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: PasswordResetRequestSchema) => {
    try {
      await resetPasswordRequest(values).unwrap();
      toast.success(
        "Password reset request sent. Please check your email and follow the instructions.",
      );
      reset({}, { keepErrors: false });
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
      toast.error(
        errorMessage || "Failed to send the request. Please try again later.",
      );
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
          label="Email Address"
          name="email"
          register={register}
          errors={errors}
          placeholder="Email Address"
          startIcon={<MailIcon className="size-8 dark:text-babyPowder" />}
        />
        <Button
          type="submit"
          className="h4-semibold w-full bg-eerieBlack text-white dark:bg-pumpkin dark:text-amberText"
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label={
            isLoading
              ? "Processing request..."
              : "Submit password reset request"
          }
        >
          {isLoading ? <Spinner size="sm" /> : "Request Password Reset"}
        </Button>
      </form>
    </main>
  );
}
