"use client";

import { useGetMyApartmentsQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import React from "react";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import ApartmentCard from "../cards/ApartmentCard";
import clsx from "clsx";

export default function Apartments() {
  const { data, isLoading, isError } = useGetMyApartmentsQuery({ page: 1 });
  const myApartments = data?.apartment.results;
  const totalApartments = data?.apartment.count || 0;

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

  return (
    <TabsContent value="my-apartments">
      <h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin text-xl">
        Total: ({totalApartments || 0})
      </h2>
      <div
        className={clsx("m-4 grid cursor-pointer gap-4 p-1.5", {
          "grid-cols-1": !myApartments || totalApartments === 0,
          "md:grid-cols-2 lg:grid-cols-3": myApartments && totalApartments > 0,
        })}
      >
        {" "}
        {myApartments && totalApartments > 0 ? (
          myApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))
        ) : (
          <p className="h2-semibold dark:text-lime-500">No apartments found!</p>
        )}
      </div>
    </TabsContent>
  );
}
