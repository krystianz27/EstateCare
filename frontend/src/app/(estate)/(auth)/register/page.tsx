"use client";

import { AuthFormHeader, RegisterForm } from "@/components/forms/auth";
import OAuthButtons from "@/components/shared/OAuthButtons";
import { useRedirectIfAuthenticated } from "@/hooks";

import Image from "next/image";
import buildingImage from "@/../public/assets/images/photo15.webp";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/welcome";
  useRedirectIfAuthenticated(redirectUrl);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={buildingImage}
          alt="Apartments"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>

      <div className="relative z-10 my-4 mb-10 flex min-h-screen items-center justify-center overflow-auto px-4">
        <div className="dark:bg-deepBlueGrey/90 w-full  rounded-2xl  bg-zinc-50/90 sm:max-w-[480px]">
          <AuthFormHeader
            title="Sign up"
            staticText="Already have an account?"
            linkText="Login"
            linkHref="/login"
          />

          <div className="rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
            <RegisterForm />

            <div className="flex-center mt-5 space-x-2">
              <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div>
              <span className="dark:text-platinum px-2 text-sm">Or</span>
              <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div>
            </div>
            <OAuthButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
