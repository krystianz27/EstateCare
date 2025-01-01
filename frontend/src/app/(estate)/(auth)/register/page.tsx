import { AuthFormHeader, RegisterForm } from "@/components/forms/auth";

export default function RegisterPage() {
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
        </div>
      </div>
    </div>
  );
}
