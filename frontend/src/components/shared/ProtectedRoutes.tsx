"use client";
import { setAuth, setLogout } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks/typedHooks";
import { getCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthState = async () => {
      const isLoggedIn = getCookie("logged_in") === "true";
      const savedRole = localStorage.getItem("role") || null;

      if (!isLoggedIn) {
        dispatch(setLogout());
        localStorage.removeItem("role");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        // return;
      } else {
        const validRole =
          savedRole === "owner" || savedRole === "tenant" ? savedRole : null;
        dispatch(setAuth({ role: validRole }));
        setIsLoading(false);
      }
    };

    handleAuthState();
  }, [dispatch, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
