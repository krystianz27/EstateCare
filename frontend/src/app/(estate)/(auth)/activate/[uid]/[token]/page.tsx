"use client";

import * as React from "react";
import { useActivateUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ActivationProps {
  params: Promise<{
    uid: string;
    token: string;
  }>;
}

export default function ActivationPage({ params }: ActivationProps) {
  const router = useRouter();
  const { uid, token } = React.use(params);

  const [activateUser, { isLoading, isSuccess, isError, error }] =
    useActivateUserMutation();

  useEffect(() => {
    activateUser({ uid, token });
  }, [activateUser, uid, token]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully!");
      router.push("/login");
    }
    if (isError) {
      toast.error("Failed to activate your account");
    }
  }, [isSuccess, isError, error, router]);

  let messageContent;
  if (isLoading) {
    messageContent = (
      <div className="flex-center">
        <span className="mr-2">⏰</span>
        <span>Activating your account....Please wait</span>
        <span className="ml-2">🥱</span>
      </div>
    );
  } else if (isSuccess) {
    messageContent = (
      <div>
        <span>Account Activated successfully!</span>
        <span className="mr-2">✅</span>
      </div>
    );
  } else if (isError) {
    messageContent = (
      <div>
        <span>Your account has already been activated.</span>
        <span className="mr-2">✅</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h3 className="dark:text-platinum font-robotoSlab text-2xl font-bold text-gray-800 sm:text-4xl md:text-5xl">
          {messageContent}
        </h3>
      </div>
    </div>
  );
}
