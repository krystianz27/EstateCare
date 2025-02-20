"use client";

import { AuthFormHeader, LoginForm } from "@/components/forms/auth";
import OAuthButtons from "@/components/shared/OAuthButtons";
import { useRedirectIfAuthenticated } from "@/hooks";
import buildingImage from "@/../public/assets/images/photo18.webp";
import Image from "next/image";

export default function LoginPage() {
  useRedirectIfAuthenticated();
  return (
    <>
      <div className="relative mt-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={buildingImage}
            alt="Apartments"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>

        <div className="relative z-10 my-2 flex  justify-center overflow-auto px-4">
          <div className="dark:bg-deepBlueGrey/90 w-full  rounded-2xl bg-zinc-50/90 sm:max-w-[480px]">
            <AuthFormHeader
              title="Login to your account"
              staticText="Don't have an account?"
              linkText="Register Here"
              linkHref="/register"
            />
            <div className="rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
              <LoginForm />
              <div className="flex-center mt-5 space-x-2">
                <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div>
                <span className="dark:text-platinum px-2 text-sm text-slate-800">
                  Or
                </span>
                <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div>
              </div>
              <OAuthButtons />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
