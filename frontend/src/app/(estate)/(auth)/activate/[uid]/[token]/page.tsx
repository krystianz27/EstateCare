"use client";

import { useActivateUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// interface ActivationProps {
//   params: {
//     uid: string;
//     token: string;
//   };
// }

// export default function ActivationPage({ params }: ActivationProps) {
export default function ActivationPage() {
  const router = useRouter();
  // const { uid, token } = params;
  const searchParams = useSearchParams();
  const [isParamsReady, setIsParamsReady] = useState(false);

  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [activateUser, { isLoading, isSuccess, isError, error }] =
    useActivateUserMutation();

  useEffect(() => {
    const fetchedUid = searchParams?.get("uid");
    const fetchedToken = searchParams?.get("token");

    if (fetchedUid && fetchedToken) {
      setUid(fetchedUid);
      setToken(fetchedToken);
      setIsParamsReady(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (uid && token) {
      setIsParamsReady(true);
    }
  }, [uid, token]);

  useEffect(() => {
    // if (uid && token) {
    if (isParamsReady && uid && token) {
      activateUser({ uid, token });
    }
  }, [isParamsReady, activateUser, uid, token]);

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
        <span className="mr-2">✅</span>
        <span>Account Activated successfully!</span>
      </div>
    );
  } else if (isError) {
    messageContent = (
      <div>
        <span className="mr-2">❌</span>
        <span>Your account has already been activated...</span>
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
