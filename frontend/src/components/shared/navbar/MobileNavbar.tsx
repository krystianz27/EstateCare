"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HomeModernIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuthNavigation } from "@/hooks";

function LeftNavContent() {
  const pathname = usePathname();
  const { filteredLeftNavLinks } = useAuthNavigation();
  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {filteredLeftNavLinks.map((linkItem) => {
        const isActive =
          (pathname.includes(linkItem.path) && linkItem.path.length > 1) ||
          pathname === linkItem.path;
        return (
          <SheetClose asChild key={linkItem.path}>
            <Link
              href={linkItem.path}
              className={`${
                isActive
                  ? "electricIndigo-gradient text-babyPowder rounded-lg"
                  : "text-baby_richBlack"
              } items-justify-start flex gap-4 bg-transparent p-4`}
            >
              <Image
                src={linkItem.imgLocation}
                alt={linkItem.label}
                width={22}
                height={22}
                className={`${isActive ? "" : "color-invert"}`}
                style={{ objectFit: "contain", width: "22px", height: "22px" }}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {linkItem.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
}

export default function MobileNavbar() {
  const { handleLogout, isAuthenticated } = useAuthNavigation();

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Image
          src="/assets/icons/mobile-menu.svg"
          alt="Mobile Menu"
          width={36}
          height={36}
          className="invert-colors lg:hidden"
        ></Image>
      </SheetTrigger>

      <SheetContent
        side="left"
        aria-labelledby="sheet-title"
        aria-describedby="sheet-description"
        className="bg-baby_rich scrollbar-thin  
        max-h-screen overflow-y-auto border-none
        pb-10"
      >
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>
              Navigation menu for Estate Care Apartments. You can navigate to
              different sections, register, or log in.
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>

        <Link href="/" className="flex items-center gap-1">
          <HomeModernIcon className="mr-2 size-11 text-lime-500">
            <p className="h2-bold text-baby_veryBlack font-robotoSlab">
              Estate Care <span className="text-lime-500">Apartments</span>
            </p>
          </HomeModernIcon>
        </Link>

        <div>
          <SheetClose asChild>
            <LeftNavContent />
          </SheetClose>

          <SheetClose asChild>
            <SheetFooter className="flex flex-col gap-3">
              {isAuthenticated ? (
                <Button
                  key="logout"
                  onClick={handleLogout}
                  className="electricIndigo-gradient small-medium light-border-2 
                  btn-tertiary text-babyPowder mt-4 min-h-[41px] w-full 
                  rounded-lg border px-4 py-3 shadow-none"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex w-full flex-col gap-2">
                  <Link href="/login" key="login" className="w-full">
                    <Button
                      className="lime-gradient small-medium light-border-2 
                      btn-tertiary text-baby_ballon mt-4 
                      min-h-[41px] w-full rounded-lg border px-4 py-3 
                      shadow-none"
                    >
                      Login
                    </Button>
                  </Link>

                  <Link href="/register" key="register" className="w-full">
                    <Button
                      className="electricIndigo-gradient small-medium light-border-2 
                      btn-tertiary text-baby_ballon mt-4 
                      min-h-[41px] w-full rounded-lg border px-4 py-3 
                      shadow-none"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </SheetFooter>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
