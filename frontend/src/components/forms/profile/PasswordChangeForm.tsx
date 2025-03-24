import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "@/lib/redux/features/auth/authApiSlice";
import { Button } from "@/components/ui/button";
import { FormFieldComponent } from "../FormFieldComponent";
import { toast } from "react-toastify";
import { PasswordChangeSchema } from "@/lib/validation";
import Spinner from "@/components/shared/Spinner";

export default function PasswordChangeForm() {
  const [changePassword, { isLoading: isPasswordChanging }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: passwordReset,
  } = useForm<PasswordChangeSchema>();

  const handleChangePassword = async (data: PasswordChangeSchema) => {
    const { current_password, new_password, confirm_new_password } = data;

    if (new_password !== confirm_new_password) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await changePassword({
        current_password,
        new_password,
      }).unwrap();
      toast.success("Password changed successfully.");
      passwordReset();
    } catch (error) {
      toast.error("Error changing password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleChangePassword)}
      className="mt-4 flex flex-col gap-4"
    >
      <FormFieldComponent
        label="Current Password"
        name="current_password"
        placeholder="Enter current password"
        register={register}
        errors={errors}
        isPassword={true}
      />
      <FormFieldComponent
        label="New Password"
        name="new_password"
        placeholder="Enter new password"
        register={register}
        errors={errors}
        isPassword={true}
      />
      <FormFieldComponent
        label="Confirm New Password"
        name="confirm_new_password"
        placeholder="Confirm new password"
        register={register}
        errors={errors}
        isPassword={true}
      />
      <Button
        type="submit"
        className="h4-semibold bg-eerieBlack dark:bg-pumpkin dark:text-amberText mt-2 w-full text-white"
        disabled={isPasswordChanging}
      >
        {isPasswordChanging ? <Spinner size="sm" /> : "Change Password"}
      </Button>
    </form>
  );
}
