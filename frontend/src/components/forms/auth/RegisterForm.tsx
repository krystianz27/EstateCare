"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact2Icon, MailIcon, UserCheck2 } from "lucide-react";
import { useRegisterUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerUserSchema, RegisterUserSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { FormFieldComponent } from "@/components/forms/FormFieldComponent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { JSX } from "react";

type FormFieldData = {
  name:
    | "username"
    | "first_name"
    | "last_name"
    | "email"
    | "password"
    | "re_password";
  label: string;
  placeholder: string;
  startIcon?: JSX.Element;
  isPassword?: boolean;
};

const formFields: FormFieldData[] = [
  {
    label: "Username",
    name: "username",
    placeholder: "Username",
    startIcon: <UserCheck2 className="dark:text-babyPowder size-8" />,
  },
  {
    label: "First Name",
    name: "first_name",
    placeholder: "First Name",
    startIcon: <Contact2Icon className="dark:text-babyPowder size-8" />,
  },
  {
    label: "Last Name",
    name: "last_name",
    placeholder: "Last Name",
    startIcon: <Contact2Icon className="dark:text-babyPowder size-8" />,
  },
  {
    label: "Email Address",
    name: "email",
    placeholder: "Email Address",
    startIcon: <MailIcon className="dark:text-babyPowder size-8" />,
  },
  {
    label: "Password",
    name: "password",
    placeholder: "Password",
    isPassword: true,
  },
  {
    label: "Password Confirm",
    name: "re_password",
    placeholder: "Confirm Password",
    isPassword: true,
  },
];

export default function RegisterForm() {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    mode: "all",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      re_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerUserSchema>) => {
    try {
      await registerUser(values).unwrap();
      toast.success("An email with an activation link has been sent");
      router.push("/login");
      reset();
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
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
        {formFields.map((field) => (
          <FormFieldComponent
            key={field.name}
            label={field.label}
            name={field.name}
            register={register}
            errors={errors}
            placeholder={field.placeholder}
            startIcon={field.startIcon}
            isPassword={field.isPassword}
          />
        ))}

        <Button
          type="submit"
          className="h4-semibold bg-eerieBlack dark:bg-pumpkin w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : `Submit`}
        </Button>
      </form>
    </main>
  );
}
