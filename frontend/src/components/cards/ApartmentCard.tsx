import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, HomeIcon } from "lucide-react";
import { Apartment } from "@/types";

interface ApartmentCardProps {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link href={`/apartment/${apartment.id}`} key={apartment.id}>
      <Card
        key={apartment.id}
        className="dark:border-gray hover:dark:border-platinum rounded-xl border border-dashed hover:border-slate-300"
      >
        <CardHeader>
          <CardTitle className="flex-center h3-semibold font-robotoSlab dark:text-lime-500">
            Apartment {apartment.apartment_number || "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="dark:text-platinum">
            <p className="h4-semibold">Street: {apartment.street}</p>
            {apartment.building_number && (
              <p className="h4-semibold">
                Building Number: {apartment.building_number}
              </p>
            )}
            <p className="h4-semibold">City: {apartment.city}</p>
            {apartment.postal_code && (
              <p className="h4-semibold">
                Postal Code: {apartment.postal_code}
              </p>
            )}
            <p className="h4-semibold">Country: {apartment.country}</p>
          </CardDescription>
        </CardContent>

        <CardContent>
          <CardDescription className="dark:text-platinum">
            <p className="flex items-center space-x-2">
              <Building className="tab-icon" />
              <span className="tab-font">Building Number: </span>
              <span className="text-lg">{apartment.building_number}</span>
            </p>
            {apartment.apartment_number && (
              <p className="flex items-center space-x-2">
                <HomeIcon className="tab-icon" />
                <span className="tab-font">Apartment Number: </span>
                <span className="text-lg">{apartment.apartment_number}</span>
              </p>
            )}
          </CardDescription>
        </CardContent>

        <CardFooter className="dark:text-babyPowder flex flex-col items-start justify-between">
          <div>
            <span className="mr-0.5 font-bold">Owner: </span>
            <span className="text-lg">
              {apartment.owner.first_name} {apartment.owner.last_name}
            </span>
          </div>
          <div>
            <span className="mr-0.5 font-bold">Tenants: </span>
            <span className="text-lg">
              {apartment.tenants.length > 0
                ? apartment.tenants.map((tenant, index) => (
                    <span key={tenant.id}>
                      {tenant.first_name} {tenant.last_name}
                      {index < apartment.tenants.length - 1 && ", "}
                    </span>
                  ))
                : "No tenants"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
