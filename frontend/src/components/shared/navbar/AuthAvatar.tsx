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
import { BookMarked, CircleUser, LogOut, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthAvatar() {
  const { handleLogout } = useAuthNavigation();
  const { profile, isLoading, isError } = useProfile();
  const router = useRouter();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading profile.</p>;
  }

  if (!profile) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="border-pumpkin cursor-pointer border-2">
          <AvatarImage alt="auth image" src={profile.avatar} />
          <AvatarFallback>
            <CircleUser className="dark:text-platinum size-8" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:text-platinum bg-white/90 dark:bg-black/85">
        <DropdownMenuLabel className="border-b-2">
          Manage Account
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            router.push("/profile");
          }}
          className="auth-nav"
        >
          <User className="mr-1" /> My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push("/tenants");
          }}
          className="auth-nav"
        >
          <Users className="mr-1" /> Tenants
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push("/bookmarks");
          }}
          className="auth-nav"
        >
          <BookMarked className="mr-1" /> My Bookmarks
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex-row-center auth-nav cursor-pointer"
        >
          <LogOut className="mr-1" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
