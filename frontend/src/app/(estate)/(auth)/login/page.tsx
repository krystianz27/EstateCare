"use client";
import { AuthFormHeader, LoginForm } from "@/components/forms/auth";

export default function LoginPage() {
  return (
    <div>
      <AuthFormHeader
        title="Login to your account"
        staticText="Don't have an account?"
        linkText="Register Here"
        linkHref="/register"
      />
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="dark:bg-deepBlueGrey rounded-xl bg-zinc-50 px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
          <LoginForm />
          {/* <div className="flex-center mt-5 space-x-2"> */}
          {/* <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div> */}
          {/* <div className="bg-richBlack dark:bg-platinum h-px flex-1"></div> */}
        </div>
      </div>
    </div>
    // </div>
  );
}
