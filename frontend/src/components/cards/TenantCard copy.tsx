"use client";

import { useGetMyTenantsQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useTheme } from "next-themes";

import React, { useState } from "react";
import Spinner from "../shared/Spinner";
import UserSearch from "../shared/search/UsersSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import TenantInfo from "./TenantInfo";
import {
  BrickWall,
  CalendarDays,
  Map,
  Home,
  Mailbox,
  Landmark,
  Briefcase,
  Building,
  School,
} from "lucide-react";

import { formatDate } from "@/utils";
import ProtectedRoute from "../shared/ProtectedRoutes";
import { Avatar, AvatarImage } from "../ui/avatar";
import PaginationLocal from "../shared/PaginationLocal";
import { useSearchParams } from "next/navigation";
import { Tenant } from "@/types";

function TenantCardContent() {
  const { theme } = useTheme();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [searchUserTerm, setUserSearchTerm] = useState<string>("");

  const { data, isLoading } = useGetMyTenantsQuery({
    searchTerm: searchUserTerm,
    page: currentPage,
  });

  const totalCount = data?.profiles.count || 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 9) : 1;

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      <UserSearch setSearchTerm={setUserSearchTerm} />
      <h1 className="flex-center font-robotoSlab dark:text-pumpkin text-4xl sm:text-5xl">
        All Tenants - ({data?.profiles.count})
      </h1>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {data && data.profiles.results.length > 0 ? (
          data.profiles.results.map((tenant: Tenant) => (
            <Card key={tenant.id}>
              <CardContent className="rounded-lg p-4">
                <CardHeader className="flex-col-center text-center">
                  <Avatar className="border-pumpkin mx-auto size-28 overflow-hidden rounded-full border-4 object-cover">
                    <AvatarImage
                      alt="User profile avatar"
                      src={
                        tenant.avatar ||
                        (theme === "dark"
                          ? "/assets/icons/user-profile-circle.svg"
                          : "/assets/icons/user-profile-light-circle.svg")
                      }
                    />
                  </Avatar>
                  <CardTitle className="h3-semibold font-robotoSlab dark:text-platinum">
                    {tenant.full_name}
                  </CardTitle>
                </CardHeader>
                <CardTitle className="flex-center">
                  <p className="h4-semibold dark:text-lime-500">
                    @{tenant.username}
                  </p>
                </CardTitle>
                <CardDescription className="mt-4 space-y-2 border-b-0">
                  <div>
                    <TenantInfo
                      label="Country"
                      value={tenant.country_of_origin}
                      icon={Map}
                    />
                    <TenantInfo
                      label="City"
                      value={tenant.city_of_origin}
                      icon={Map}
                    />
                    <TenantInfo
                      label="Joined Date"
                      value={formatDate(tenant.date_joined).toString()}
                      icon={CalendarDays}
                    />
                  </div>
                  {tenant.apartment && (
                    <>
                      <TenantInfo
                        label="Street"
                        value={tenant.apartment.street}
                        icon={Home}
                      />
                      <TenantInfo
                        label="Building Number"
                        value={tenant.apartment.building_number || "N/A"}
                        icon={Landmark}
                      />
                      <TenantInfo
                        label="Apartment Number"
                        value={tenant.apartment.apartment_number || "N/A"}
                        icon={BrickWall}
                      />
                      <TenantInfo
                        label="City"
                        value={tenant.apartment.city}
                        icon={Map}
                      />
                      <TenantInfo
                        label="Postal Code"
                        value={tenant.apartment.postal_code}
                        icon={Mailbox}
                      />
                      <TenantInfo
                        label="Country"
                        value={tenant.apartment.country}
                        icon={Map}
                      />
                    </>
                  )}
                </CardDescription>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No tenants found</p>
        )}
      </div>
      <PaginationLocal totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}

export default function TenantCard() {
  return (
    <ProtectedRoute>
      <TenantCardContent />
    </ProtectedRoute>
  );
}
