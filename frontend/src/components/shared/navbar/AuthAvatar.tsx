"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthNavigation } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import { LogOut, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AuthAvatar() {
  const { handleLogout, isAuthenticated } = useAuthNavigation();
  const { profile, isLoading, isError } = useProfile();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  // const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isAuthenticatedState, setIsAuthenticatedState] =
    useState(isAuthenticated);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsAuthenticatedState(isAuthenticated);
  }, [isAuthenticated, isAuthenticatedState, router]);

  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading profile.</p>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="">
          {isLoading || isError || !isAuthenticated || !profile ? (
            <AvatarFallback className="dark:bg-slate-900">
              <User className="dark:text-platinum size-7" />
            </AvatarFallback>
          ) : (
            <AvatarImage
              alt="auth image"
              src={profile.avatar}
              // width={10}
              // height={10}
            />
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:text-platinum bg-white/90 dark:bg-black/85">
        {isAuthenticated && profile ? (
          <>
            {/* <DropdownMenuLabel className="border-b-2"></DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}

            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="auth-nav"
            >
              <User className="mr-1" /> My Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/apartment")}
              className="auth-nav"
            >
              <Users className="mr-1" /> Apartments
            </DropdownMenuItem>

            {/* <DropdownMenuItem
          onClick={() => {
            router.push("/tenants");
          }}
          className="auth-nav"
        >
          <Users className="mr-1" /> Tenants
        </DropdownMenuItem> */}

            {/* <DropdownMenuItem
          onClick={() => {
            router.push("/bookmarks");
          }}
          className="auth-nav"
        >
          <BookMarked className="mr-1" /> My Bookmarks
        </DropdownMenuItem> */}
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex-row-center auth-nav cursor-pointer"
            >
              <LogOut className="mr-1" /> Log Out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push("/login")}
            className="auth-nav"
          >
            <LogOut className="mr-1" /> Log In
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
