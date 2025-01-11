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
import { Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Apartment {
  id: string;
  created_at: string;
  unit_number: string;
  building: string;
  floor: number;
}

interface ApartmentCardProps {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link href={`/apartment/${apartment.id}`} key={apartment.id}>
      <Card
        key={apartment.id}
        className="hover:border-pumpkin dark:border-gray hover:dark:border-platinum rounded-xl border border-dashed"
      >
        <CardHeader>
          <CardTitle className="flex-center h3-semibold font-robotoSlab dark:text-lime-500">
            Apartment {apartment.unit_number}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="dark:text-platinum">
            <p className="h4-semibold">Building: {apartment.building}</p>
          </CardDescription>
        </CardContent>

        <CardContent>
          <CardDescription className="dark:text-platinum">
            <p className="flex items-center space-x-2">
              <Building className="tab-icon" />
              <span className="tab-font">Floor: </span>
              <span className="text-lg">{apartment.floor}</span>
            </p>
          </CardDescription>
        </CardContent>

        <CardFooter className="dark:text-babyPowder flex flex-row justify-between">
          <div>
            <span className="mr-0.5 font-bold">Created: </span>
            <Badge className="bg-eerieBlack text-babyPowder dark:bg-electricIndigo dark:text-babyPowder">
              {new Date(apartment.created_at).toLocaleDateString()}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
