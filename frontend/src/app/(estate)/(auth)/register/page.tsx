"use client";

import { AuthFormHeader, RegisterForm } from "@/components/forms/auth";
import OAuthButtons from "@/components/shared/OAuthButtons";
import { useRedirectIfAuthenticated } from "@/hooks";

export default function RegisterPage() {
  useRedirectIfAuthenticated();
  return (
    <div>
      <AuthFormHeader
        title="Sign up"
        staticText="Already have an account?"
        linkText="Login"
        linkHref="/login"
      />

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div
          className="dark:bg-deepBlueGrey rounded-xl
            bg-zinc-50 px-6 py-12
            shadow sm:rounded-lg sm:px-12 md:rounded-3xl"
        >
          <RegisterForm />

          <div className="flex-center mt-5 space-x-2">
            <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div>
            <span className="dark: text-platinum px-2 text-sm">Or</span>
            <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div>
          </div>
          <OAuthButtons />
        </div>
      </div>
    </div>
  );
}
