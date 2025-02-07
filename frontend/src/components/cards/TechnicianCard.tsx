"use client";

import { useGetAllTechniciansQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { UserState } from "@/types";
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
import PaginationSection from "../shared/Pagination";

export default function TechnicianCard() {
  const { theme } = useTheme();

  const searchTerm = useAppSelector(
    (state: UserState) => state.user.searchTerm,
  );
  const page = useAppSelector((state: UserState) => state.user.page);

  const { data, isLoading } = useGetAllTechniciansQuery({ searchTerm, page });
  const technicians = data?.non_tenant_profiles?.results || [];

  const totalCount = technicians.length;
  const totalPages = Math.ceil(totalCount / 9);

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
        <UsersSearch />
        <h1 className="flex-center font-robotoSlab text-5xl dark:text-pumpkin">
          All Technicians - (0)
        </h1>
        <p className="h2-semibold dark:text-lime-500">No technicians found!</p>
      </div>
    );
  }

  return (
    <div>
      <UsersSearch />
      <h1 className="flex-center font-robotoSlab text-5xl dark:text-pumpkin">
        All Technicians - ({technicians.length})
      </h1>

      <div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
        {technicians.map((technician) => (
          <Card key={technician.id}>
            <CardContent className="rounded-lg border dark:border-gray">
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
                  occupation={technician.occupation}
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
                    className="electricIndigo-gradient mt-3 text-babyPowder"
                  >
                    Rate This Professional
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <PaginationSection totalPages={totalPages} entityType="user" />
    </div>
  );
}
