"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks/typedHooks";
import { useForm } from "react-hook-form";
import { loginUserSchema, LoginUserSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { setAuth } from "@/lib/redux/features/auth/authSlice";
import { FormFieldComponent } from "@/components/forms/FormFieldComponent";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

export default function LoginForm() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginUserSchema) => {
    try {
      await loginUser(values).unwrap();
      dispatch(setAuth());
      toast.success("Login Successful");
      router.push("/welcome");
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
          label="Email Address"
          name="email"
          register={register}
          errors={errors}
          placeholder="Email Address"
          startIcon={<MailIcon className="size-8 dark:text-babyPowder" />}
        />

        <FormFieldComponent
          label="Password"
          name="password"
          register={register}
          errors={errors}
          placeholder="Password"
          isPassword={true}
          link={{ linkText: "Forgot Password?", linkUrl: "/forgot-password" }}
        />
        <Button
          type="submit"
          className="h4-semibold w-full bg-eerieBlack text-white dark:bg-pumpkin dark:text-amberText"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Sign In"}
        </Button>
      </form>
    </main>
  );
}
