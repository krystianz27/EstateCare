import { setAuth } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks/typedHooks";
import { SocialAuthArgs, SocialAuthResponse } from "@/types";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  TypedMutationTrigger,
} from "@reduxjs/toolkit/query/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function useSocialAuth(
  triggerSocialAuth: TypedMutationTrigger<
    SocialAuthResponse,
    SocialAuthArgs,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
  >,
  provider: string,
) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const effectRan = useRef(false);

  useEffect(() => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    if (state && code && !effectRan.current) {
      triggerSocialAuth({ provider, state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth({ role: "owner" }));
          toast.success("Logged in successfully");
          router.push("/welcome");
        })
        .catch(() => {
          toast.error("Login Failed, Try Again!");
          router.push("/auth/login");
        });
    }
    return () => {
      effectRan.current = true;
    };
  }, [triggerSocialAuth, dispatch, provider, router, searchParams]);
}
