import TechnicianCard from "@/components/cards/TechnicianCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Technicians",
  description:
    "Browse through a list of technicians, view their specialties, and check their ratings to find the right professional for your needs.",
};

export default function TechniciansPage() {
  return (
    <>
      <TechnicianCard />
    </>
  );
}
