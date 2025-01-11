"use client";

import { useReportTenantMutation } from "@/lib/redux/features/report/reportApiSlice";
import { reportCreateSchema, ReportCreateSchema } from "@/lib/validation";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { Contact2Icon, FlagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import ProtectedRoutes from "@/components/shared/ProtectedRoutes";

export default function ReportCreateForm() {
  const router = useRouter();
  const [reportTenant, { isLoading }] = useReportTenantMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportCreateSchema>({
    resolver: zodResolver(reportCreateSchema),
    mode: "all",
  });

  const onSubmit = async (values: ReportCreateSchema) => {
    try {
      await reportTenant(values).unwrap();
      toast.success(
        "Your report has been submitted successfully. The management will review it promptly.",
      );
      reset();
      router.push("/profile");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || "An error occurred");
    }
  };
  return (
    <ProtectedRoutes>
      <main>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-md flex-col gap-4 dark:text-black"
        >
          <FormFieldComponent
            label="Title"
            name="title"
            register={register}
            errors={errors}
            placeholder="Title"
            startIcon={<FlagIcon className="dark:text-babyPowder size-8" />}
          />
          <FormFieldComponent
            label="Tenant's Username"
            name="reported_user_username"
            register={register}
            errors={errors}
            placeholder="Add Tenants Username"
            startIcon={<Contact2Icon className="dark:text-babyPowder size-8" />}
          />
          <FormFieldComponent
            label="Description"
            name="description"
            register={register}
            errors={errors}
            placeholder="Detailed Description of the problem"
            isTextArea
          />
          <Button
            type="submit"
            className="h4-semibold bg-eerieBlack dark:bg-pumpkin mt-2 w-full text-white"
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? <Spinner size="sm" /> : "Send Report"}
          </Button>
        </form>
      </main>
    </ProtectedRoutes>
  );
}
