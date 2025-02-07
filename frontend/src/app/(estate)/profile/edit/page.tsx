import { AuthFormHeader } from "@/components/forms/auth";
import EditProfileForm from "@/components/forms/profile/EditProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care Apartments | Profile Edit",
  description: "Signed in users can edit their profile information",
};

export default function EditProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="w-full max-w-[480px] rounded-xl bg-lightGrey px-6 py-12 shadow dark:bg-deepBlueGrey sm:px-12 md:rounded-3xl">
        <AuthFormHeader title="Update Profile" />
        <div className="mt-7">
          <EditProfileForm />
        </div>
      </section>
    </main>
  );
}
