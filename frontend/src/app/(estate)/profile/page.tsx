import ProtectedRoute from "@/components/shared/ProtectedRoutes";

import React from "react";

import type { Metadata } from "next";
import Header from "@/components/profile/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "@/components/profile/AboutContent";
import Posts from "@/components/profile/Posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Alpha Apartments | User Profile",
  description: "Signed in users can view all their profile information",
};

function ProfilePageContent() {
  return (
    <>
      <div className="grid items-start gap-4 py-4 md:gap-6 md:px-6">
        <Header />

        <div className="w-full">
          <Tabs
            className="dark:border-eerieBlack rounded-lg border"
            defaultValue="about"
          >
            <TabsList className="bg-baby_rich mb-10 flex flex-wrap justify-center gap-4 px-4 py-3 sm:gap-6">
              <TabsTrigger value="about" className="h3-semibold tab px-6 py-2">
                About
              </TabsTrigger>
              <TabsTrigger value="posts" className="h3-semibold tab px-6 py-2">
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="my-issues"
                className="h3-semibold tab px-6 py-2"
              >
                My Issues
              </TabsTrigger>
              <TabsTrigger
                value="my-reports"
                className="h3-semibold tab px-6 py-2"
              >
                My Reports
              </TabsTrigger>
              <TabsTrigger
                value="assigned-issues"
                className="h3-semibold tab px-6 py-2"
              >
                Assigned Issues
              </TabsTrigger>
            </TabsList>

            <About />

            <Posts />

            {/* issue tab content */}
            {/* <Issues /> */}
            {/* report tab content */}
            {/* <Reports /> */}
            {/* assigned Issue tab content */}
            {/* <AssignedIssues /> */}
          </Tabs>
        </div>
      </div>
      <div className="flex cursor-pointer flex-col gap-4 sm:flex-row sm:justify-between">
        <Link href="/profile/edit">
          <Button className="h3-semibold electricIndigo-gradient text-babyPowder w-full rounded-lg sm:w-64">
            Update Profile
          </Button>
        </Link>
        <Link href="/apartment">
          <Button className="h3-semibold electricIndigo-gradient text-babyPowder w-full rounded-lg sm:w-64">
            Add Your Apartment
          </Button>
        </Link>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
