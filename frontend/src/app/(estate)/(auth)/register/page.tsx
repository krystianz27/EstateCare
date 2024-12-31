import { AuthFormHeader } from "@/components/forms/auth";

export default function RegisterPage() {
  return (
    <div>
      <AuthFormHeader
        title="Sign up"
        staticText="Already have an account?"
        linkText="Login"
        linkHref="/login"
      />
    </div>
  );
}
