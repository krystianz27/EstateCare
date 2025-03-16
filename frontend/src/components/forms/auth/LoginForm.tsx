"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useRouter, useSearchParams } from "next/navigation";
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
import Link from "next/link";

export default function LoginForm() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";
  const dispatch = useAppDispatch();

  const role = "owner";

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
      const response = await loginUser(values).unwrap();
      if (response) {
        console.log("Role:", role);
        dispatch(setAuth({ role }));
        localStorage.setItem("role", role);
        toast.success("Login Successful");
        router.replace(redirectUrl);
        reset();
      }
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
          startIcon={<MailIcon className="dark:text-babyPowder size-8" />}
        />

        <FormFieldComponent
          label="Password"
          name="password"
          register={register}
          errors={errors}
          placeholder="Password"
          isPassword={true}
        />

        <Link
          href="/forgot-password"
          className="h4-semibold mt-2 text-indigo-500 hover:text-indigo-700 dark:text-lime-500 dark:hover:text-lime-700"
        >
          Forgot Password?
        </Link>

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Sign In"}
        </Button>
      </form>
    </main>
  );
}
