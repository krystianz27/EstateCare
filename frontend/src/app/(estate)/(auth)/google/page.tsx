"use client";

import { useSocialAuth } from "@/hooks";
import { useSocialAuthenticationMutation } from "@/lib/redux/features/auth/authApiSlice";

export default function GoogleLoginPage() {
  return <GoogleLoginContent />;
}

function GoogleLoginContent() {
  const [googleAuthenticate] = useSocialAuthenticationMutation();
  useSocialAuth(googleAuthenticate, "google-oauth2");

  return null;
}
