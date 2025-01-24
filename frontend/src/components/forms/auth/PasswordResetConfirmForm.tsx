"use client";
import { useResetPasswordConfirmMutation } from "@/lib/redux/features/auth/authApiSlice";
import {
  passwordResetConfirmSchema,
  PasswordResetConfirmSchema,
} from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "@/components/forms/FormFieldComponent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

export default function PasswordResetConfirmForm() {
  const router = useRouter();
  const { uid, token } = useParams();

  const [resetPasswordConfirm, { isLoading }] =
    useResetPasswordConfirmMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordResetConfirmSchema>({
    resolver: zodResolver(passwordResetConfirmSchema),
    mode: "all",
    defaultValues: {
      uid: uid as string,
      token: token as string,
      new_password: "",
      re_new_password: "",
    },
  });

  const onSubmit = async (values: PasswordResetConfirmSchema) => {
    try {
      await resetPasswordConfirm({
        ...values,
        uid: uid as string,
        token: token as string,
      }).unwrap();
      toast.success(
        "Your password has been reset successfully. You can now log in.",
      );
      router.push("/login");
      reset();
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
      toast.error(
        errorMessage ||
          "Failed to reset the password. Please try again or contact support.",
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
          label="New Password"
          name="new_password"
          register={register}
          errors={errors}
          placeholder="New Password"
          isPassword={true}
        />

        <FormFieldComponent
          label="Confirm Password"
          name="re_new_password"
          register={register}
          errors={errors}
          placeholder="Confirm New Password"
          isPassword={true}
        />
        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : `Confirm New Password`}
        </Button>
      </form>
    </main>
  );
}
