import { toast } from "react-toastify";

interface SocialAuthResponse {
  authorization_url: string;
}

export default async function InitiateSocialAuth(
  provider: string,
  redirect: string,
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
    if (!baseUrl) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_DOMAIN is not defined.",
      );
    }

    const url = `${baseUrl}/api/v1/auth/o/${provider}?redirect_uri=${baseUrl}/api/v1/auth/${redirect}`;

    const res: Response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      toast.error(
        `Failed to initiate social login. Server responded with status ${res.status}.`,
      );
      return;
    }

    const data: SocialAuthResponse = await res.json();

    if (typeof window !== "undefined") {
      window.location.href = data.authorization_url;
    } else {
      toast.error("Unable to redirect for social login in this environment.");
    }
  } catch (error) {
    console.error("Social auth initiation error:", error);
    toast.error("Something went wrong. Please try again later.");
  }
}
