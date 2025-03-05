import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectIfAuthenticated = (redirectUrl?: string) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated && pathname !== "/login") {
      router.push(redirectUrl || "/profile");
    }
  }, [isAuthenticated, router, redirectUrl, pathname]);
};
