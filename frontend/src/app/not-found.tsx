import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Photo404 from "@/../public/assets/images/404-error.png";

const NotFound: FC = () => {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center
     bg-black px-6 py-16 sm:py-24"
    >
      <Image
        src={Photo404}
        alt="Page Not Found"
        height={200}
        width={200}
        placeholder="blur"
      />
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-platinum text-4xl font-bold tracking-tight shadow-md sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-xl leading-7 text-white text-opacity-75 sm:text-2xl">
          Sorry, we could not find the page you are looking for.
        </p>
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
    </main>
  );
};

export default NotFound;
