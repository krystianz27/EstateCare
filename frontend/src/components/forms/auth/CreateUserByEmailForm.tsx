"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateUserByEmailMutation } from "@/lib/redux/features/auth/authApiSlice";
import {
  createUserByEmailSchema,
  CreateUserByEmailSchema,
} from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { FormFieldComponent } from "@/components/forms/FormFieldComponent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { MailIcon, Contact2Icon } from "lucide-react";
import { JSX } from "react";

type FormFieldData = {
  name: "email" | "first_name" | "last_name";
  label: string;
  placeholder: string;
  startIcon?: JSX.Element;
};

const formFields: FormFieldData[] = [
  {
    label: "Email Address",
    name: "email",
    placeholder: "Email Address",
    startIcon: <MailIcon className="dark:text-babyPowder size-8" />,
  },
  {
    label: "First Name (optional)",
    name: "first_name",
    placeholder: "First Name",
    startIcon: <Contact2Icon className="dark:text-babyPowder size-8" />,
  },
  {
    label: "Last Name (optional)",
    name: "last_name",
    placeholder: "Last Name",
    startIcon: <Contact2Icon className="dark:text-babyPowder size-8" />,
  },
];

export default function CreateUserByEmailForm({
  apartmentId,
}: {
  apartmentId: string;
}) {
  const [createUserByEmail, { isLoading }] = useCreateUserByEmailMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserByEmailSchema>({
    resolver: zodResolver(createUserByEmailSchema),
    mode: "all",
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = async (values: CreateUserByEmailSchema) => {
    try {
      await createUserByEmail({ ...values, apartmentId }).unwrap();
      toast.success(
        "User created successfully. Check your email for login details.",
      );
      reset();
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
      toast.error(errorMessage || "An error occurred");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="d w-full max-w-md rounded-3xl bg-slate-100 p-6 shadow-lg dark:bg-zinc-800">
        <h2 className="text-center text-xl font-semibold ">
          User Registration Form
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Enter the details, and the system will create an account and assign
          the user to the apartment. Login details will be sent to the provided
          email address.
        </p>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-4"
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
            />
          ))}

          <Button
            type="submit"
            className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText w-full text-white"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </form>
      </div>
    </main>
  );
}
