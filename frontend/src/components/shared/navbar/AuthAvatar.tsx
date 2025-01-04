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
import Link from "next/link";
import React from "react";

export default function AuthAvatar() {
  const { handleLogout } = useAuthNavigation();
  const { profile, isLoading, isError } = useProfile();

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

        <DropdownMenuItem className="auth-nav">
          <Link href="/profile" className="flex-row-center">
            <User className="mr-1" /> My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="auth-nav">
          <Link href="/tenants" className="flex-row-center">
            <Users className="mr-1" /> Tenants
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="auth-nav">
          <Link href="/bookmarks" className="flex-row-center">
            <BookMarked className="mr-1" /> My Bookmarks
          </Link>
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
