"use client";

import { Button } from "@/components/ui/button";
import { useAuthNavigation } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeftNavbar() {
  const pathname = usePathname();
  const { handleLogout, filteredLeftNavLinks, isAuthenticated } =
    useAuthNavigation();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      className="light-border custom-scrollbar light:bg-zinc-50 
    shadow-platinum sticky left-0 top-0 flex h-screen flex-col 
    justify-between overflow-y-auto border-r p-6 pt-20 
    max-md:hidden lg:w-[297px] dark:shadow-none"
    >
      <div className="mb-8 flex flex-1 flex-col gap-6">
        {filteredLeftNavLinks.map((linkItem, index) => {
          const isActive =
            (pathname.includes(linkItem.path) && linkItem.path.length > 1) ||
            pathname === linkItem.path;
          return (
            <Link
              href={linkItem.path}
              key={linkItem.label}
              className={`${
                isActive
                  ? "electricIndigo-gradient text-babyPowder rounded-lg"
                  : "text-baby_richBlack"
              } flex items-center justify-start gap-4 bg-transparent p-4 
               ${
                 index !== filteredLeftNavLinks.length - 1
                   ? "border-b border-slate-600"
                   : ""
               }`}
            >
              <Image
                src={linkItem.imgLocation}
                alt={linkItem.label}
                width={22}
                height={22}
                className={`${isActive ? "" : "color-invert"}`}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
              >
                {linkItem.label}
              </p>
            </Link>
          );
        })}
      </div>

      {isClient && (
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="dark:bg-amber dark:text-amberText w-full rounded-lg border bg-black px-4 py-3 text-white"
            >
              Log Out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button
                  className="lime-gradient small-medium 
              light-border-2 btn-tertiary text-baby_ballon 
              min-h-[41px] w-full rounded-lg border px-4 py-3 
              shadow-none"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="electricIndigo-gradient small-medium
                light-border-2 btn-tertiary text-baby_ballon
                min-h-[41px] w-full rounded-lg border px-4 py-3
                shadow-none"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
}
