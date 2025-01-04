import type { Metadata } from "next";
import Image from "next/image";
import buildings from "@/../public/assets/images/photo19.webp";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const metadata: Metadata = {
  title: "Estate Management",
  description: "A web application for managing estates",
};

export default function HomePage() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src={buildings}
          alt="Apartments"
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
          priority
        />
      </div>
      <main className="flex-center relative z-10 h-full bg-black/15">
        <div className="text-center">
          <h1
            className="font-robotoSlab mb-4 text-4xl font-semibold 
          text-neutral-200 text-opacity-80 antialiased sm:text-6xl md:text-8xl"
          >
            Welcome to Estate Care
          </h1>
          <p className="my-8 text-2xl text-cyan-100 text-opacity-50 sm:text-4xl">
            New to Estate Care? Or already a member?
          </p>
          <Link href="/register" prefetch={false}>
            <button className=" bg-asparagus rounded-3xl px-4 py-2 text-lg font-semibold text-white text-opacity-80 hover:bg-lime-600 sm:px-6 sm:text-2xl">
              <span className="inline-flex items-center">
                Get Started Today
                <ArrowRightIcon className="ml-2 size-6"></ArrowRightIcon>
              </span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
