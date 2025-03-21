"use client";

import { useGetAllTechniciansQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useTheme } from "next-themes";
import Spinner from "../shared/Spinner";
import UsersSearch from "../shared/search/UsersSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import TechnicianCardDetails from "./TechnicianCardDetails";
import Link from "next/link";
import { Button } from "../ui/button";
import PaginationLocal from "../shared/PaginationLocal";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TechnicianCard() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();

  const [searchTechnicianTerm, setTechnicianSearchTerm] = useState<string>("");

  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useGetAllTechniciansQuery({
    searchTerm: searchTechnicianTerm,
    page: currentPage,
  });
  const technicians = data?.non_tenant_profiles?.results || [];

  const totalCount = data?.non_tenant_profiles.count || 1;
  const totalPages = Math.ceil(totalCount / 10);

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <div>
        <UsersSearch
          setSearchTerm={setTechnicianSearchTerm}
          placeholder="Search by username, first, last name or city"
        />{" "}
        <h1 className="flex-center font-robotoSlab dark:text-pumpkin text-5xl">
          All Technicians - (0)
        </h1>
        <p className="h2-semibold dark:text-lime-500">No technicians found!</p>
      </div>
    );
  }

  return (
    <div>
      <UsersSearch
        setSearchTerm={setTechnicianSearchTerm}
        placeholder="Search by username, first, last name or city"
      />{" "}
      {/* Przekazywanie funkcji do zmiany stanu */}
      <h1 className="flex-center font-robotoSlab dark:text-pumpkin text-5xl">
        All Technicians - ({totalCount})
      </h1>
      <div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
        {technicians.map((technician) => (
          <Card key={technician.id}>
            <CardContent className="dark:border-gray rounded-lg border">
              <CardHeader className="flex-center w-full">
                <Avatar>
                  <AvatarImage
                    className="rounded-full"
                    alt="User Profile Avatar"
                    src={
                      technician.avatar ||
                      (theme === "dark"
                        ? "/assets/icons/user-profile-circle.svg"
                        : "/assets/icons/user-profile-light-circle.svg")
                    }
                    width={100}
                    height={100}
                  />
                </Avatar>

                <CardTitle className="flex-center h2-semibold font-robotoSlab dark:text-pumpkin">
                  {technician.full_name}
                </CardTitle>
              </CardHeader>

              <CardTitle className="flex-center">
                <p className="h4-semibold dark:text-lime-500">
                  @{technician.username}
                </p>
              </CardTitle>

              <CardDescription className="mt-2 grid">
                <TechnicianCardDetails
                  country_of_origin={technician.country_of_origin}
                  city_of_origin={technician.city_of_origin}
                  occupation={
                    technician.occupations.length > 0
                      ? technician.occupations.map((o) => o.name).join(", ")
                      : ""
                  }
                  date_joined={technician.date_joined}
                  average_rating={technician.average_rating}
                />
              </CardDescription>

              <div className="flex-center">
                <Link
                  href={`/technicians/create-rating?username=${technician.username}`}
                >
                  <Button
                    size="sm"
                    className="electricIndigo-gradient text-babyPowder mt-3"
                  >
                    Rate This Professional
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
