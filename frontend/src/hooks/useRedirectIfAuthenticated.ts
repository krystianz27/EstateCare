"use client";

import { setAuth } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectIfAuthenticated = (redirectUrl?: string) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = getCookie("logged_in") === "true";

    // if (isAuthenticated && pathname === "/login") {
    // if ((isAuthenticated || isLoggedIn) && pathname === "/login") {
    if (isAuthenticated || isLoggedIn) {
      if (!isAuthenticated) {
        dispatch(setAuth({ role: "owner" }));
      }
      router.push(redirectUrl || "/profile");
    }
  }, [isAuthenticated, router, redirectUrl, pathname, dispatch]);
};
