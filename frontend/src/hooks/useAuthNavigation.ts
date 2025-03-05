import { leftNavLinks } from "@/constant";
import { useLogoutUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { setLogout } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { extractErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useAuthNavigation() {
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(setLogout());
      router.push("/login");
      toast.success("Logged Out!");
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
      toast.error(errorMessage || "An error occurred");
    }
  };

  const filteredLeftNavLinks = leftNavLinks.filter((link) => {
    if (
      link.path === "/welcome" ||
      link.path === "/profile" ||
      link.path === "/apartment" ||
      link.path === "/posts" ||
      link.path === "/documents" ||
      link.path === "/tenants" ||
      link.path === "/technician" ||
      link.path === "/issue/report-issue" ||
      link.path === "/report/report-tenant" ||
      link.path === "/posts/bookmark" ||
      link.path === "/posts/create-post"
    ) {
      // return isAuthenticated;
      return true;
    }
    return true;
  });

  return { handleLogout, filteredLeftNavLinks, isAuthenticated };
}
