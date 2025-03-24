"use client";

import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useRouter } from "next/navigation";
import ProfileForm from "./ProfileForm";
import AvatarForm from "./AvatarForm";
import ChangePasswordForm from "./PasswordChangeForm";
import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EditProfileForm() {
  const { data, isLoading: isProfileLoading } = useGetUserProfileQuery();
  const router = useRouter();
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);

  if (isProfileLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <main>
      <ProfileForm profile={data?.profile} />

      <AvatarForm />

      <Button
        type="button"
        onClick={() => setIsPasswordFormVisible(!isPasswordFormVisible)}
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600 w-full"
      >
        {isPasswordFormVisible ? "Hide Change Password" : "Change Password"}
      </Button>

      {isPasswordFormVisible && <ChangePasswordForm />}

      <div className="mt-4 text-center">
        <Button
          type="button"
          onClick={() => router.push("/profile")}
          className="bg-blue-500 text-white hover:bg-blue-600 w-full"
        >
          Return to Profile
        </Button>
      </div>
    </main>
  );
}
