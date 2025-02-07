"use client";

import { AuthFormHeader, RegisterForm } from "@/components/forms/auth";
import OAuthButtons from "@/components/shared/OAuthButtons";
import { useRedirectIfAuthenticated } from "@/hooks";
import Image from "next/image";
import buildingImage from "@/../public/assets/images/photo15.webp";

export default function RegisterPage() {
  useRedirectIfAuthenticated();
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

      <div className="relative z-10 mb-10 flex min-h-screen items-center justify-center overflow-auto px-4">
        <div className=" w-full sm:max-w-[480px]">
          <AuthFormHeader
            title="Sign up"
            staticText="Already have an account?"
            linkText="Login"
            linkHref="/login"
          />

          <div
            className="mt-7 rounded-xl bg-zinc-50/30
            px-6 py-12 shadow
            dark:bg-deepBlueGrey/70 sm:rounded-lg sm:px-12 md:rounded-3xl"
          >
            <RegisterForm />

            <div className="flex-center mt-5 space-x-2">
              <div className="h-px flex-1 bg-richBlack dark:bg-platinum"></div>
              <span className="dark: px-2 text-sm text-platinum">Or</span>
              <div className="h-px flex-1 bg-richBlack dark:bg-platinum"></div>
            </div>
            <OAuthButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
