import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Photo404 from "@/../public/assets/images/custom404.webp";

const NotFound: FC = () => {
  return (
    <main
      className="flex h-screen flex-col items-center justify-center overflow-hidden
      bg-black"
    >
      <div className="relative size-full">
        <Image
          src={Photo404}
          alt="Page Not Found"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="bg-slate-600/30 text-4xl font-bold tracking-tight text-white text-opacity-90 shadow-md sm:text-5xl">
            Sorry, we could not find the page you are looking for.
          </h1>

          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/welcome"
              aria-label="Go back to the homepage"
              className="rounded-3xl bg-green-700 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-lime-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:px-3.5 sm:py-2.5 sm:text-2xl"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
