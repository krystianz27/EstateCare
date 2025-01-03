"use client";

import { UseGoogleAuth } from "@/utils";
import OAuthButton from "./OAuthButton";

export default function OAuthButtons() {
  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <OAuthButton provider="google" onClick={UseGoogleAuth}>
        Sign in with Google
      </OAuthButton>
    </div>
  );
}
