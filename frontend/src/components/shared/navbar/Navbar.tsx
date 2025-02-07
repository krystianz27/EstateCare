import { HomeModernIcon } from "@heroicons/react/24/solid";
import React from "react";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import MobileNavbar from "./MobileNavbar";
import AuthAvatar from "@/components/shared/navbar/AuthAvatar";

export default function Navbar() {
  return (
    <nav
      className="flex-between bg-baby_rich fixed z-50 w-full 
    gap-5 border-b-2 border-b-platinum p-4 shadow-platinum dark:border-b-0 dark:shadow-none sm:p-6 lg:px-12"
      aria-label="Main navigation"
      role="navigation"
    >
      <MobileNavbar />

      <Link href="/" className="flex items-center">
        <HomeModernIcon className="mr-2 size-11 text-lime-500" />
        <p className="h2-bold hidden font-robotoSlab text-veryBlack dark:text-babyPowder sm:block">
          Estate Care <span className="text-lime-500"> Apartments</span>
        </p>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        <ThemeSwitcher />
        <AuthAvatar />
      </div>
    </nav>
  );
}
