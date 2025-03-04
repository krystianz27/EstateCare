"use client";

import { useGetAllMyApartmentsQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import React from "react";
import Spinner from "../shared/Spinner";
import ApartmentCard from "../cards/ApartmentCard";
import { useSearchParams } from "next/navigation";
import PaginationLocal from "../shared/PaginationLocal";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Apartments() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useGetAllMyApartmentsQuery({
    page: currentPage,
  });
  const myApartments = data?.apartment.results;

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-center pt-32">
        <p className="h2-semibold dark:text-red-500">
          Failed to load apartments. Please try again later.
        </p>
      </div>
    );
  }

  const totalPages = myApartments ? Math.ceil(data?.apartment.count / 10) : 0;

  return (
    <div className="my-4 flex-col rounded-2xl bg-zinc-50 py-4 max-md:my-4 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-center">
        <Link href="/apartment/add">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full rounded-lg bg-zinc-800 text-white sm:w-64">
            Add New Apartment
          </Button>
        </Link>
      </div>

      <h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin mt-4 text-xl">
        Total: {data?.apartment.count}
      </h2>

      <div className="mb-4 mt-7 grid flex-1 grid-cols-1 gap-6 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {myApartments && data.apartment.count > 0 ? (
          myApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))
        ) : (
          <p className="h2-semibold dark:text-lime-500">No apartments found!</p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
