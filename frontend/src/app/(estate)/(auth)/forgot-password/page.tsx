import React from "react";

import type { Metadata } from "next";
import { AuthFormHeader } from "@/components/forms/auth";
import PasswordResetRequestForm from "@/components/forms/auth/PasswordResetRequestForm";

export const metadata: Metadata = {
  title: "Estate Care | Reset Your Password",
  description:
    "Request a password reset to regain access to your Estate Care account quickly and securely.",
};

export default function ForgotPassword() {
  return (
    <div>
      <AuthFormHeader
        title="Request a password reset for your account"
        staticText="Need to log in instead?"
        linkText="Return to the login page"
        linkHref="/login"
        aria-label="Go back to the login page to sign in with your account"
      />

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightGrey px-6 py-12 shadow dark:bg-deepBlueGrey sm:rounded-lg sm:px-12 md:rounded-3xl">
          <PasswordResetRequestForm />
        </div>
      </div>
    </div>
  );
}
