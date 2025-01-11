import ProtectedRoute from "@/components/shared/ProtectedRoutes";

import React from "react";

import type { Metadata } from "next";
import Header from "@/components/profile/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "@/components/profile/AboutContent";
import Posts from "@/components/profile/Posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Issues from "@/components/issue/Issues";
import IssuesAsigned from "@/components/issue/IssuesAsigned";
import Reports from "@/components/profile/Reports";
import Apartments from "@/components/apartment/Apartments";

export const metadata: Metadata = {
  title: "Estate Care | User Profile",
  description: "Signed in users can view all their profile information",
};

function ProfilePageContent() {
  return (
    <>
      <div className="grid items-start gap-4 py-4 md:gap-6 md:px-6">
        <Header />

        <div className="w-full">
          <Tabs
            className="dark:border-eerieBlack space-y-6 rounded-lg border"
            defaultValue="about"
          >
            <TabsList
              className="bg-baby_rich mb-6 grid min-h-32 grid-cols-2 gap-4 rounded-lg  px-4 
              py-3 max-md:min-h-32 sm:gap-6 md:grid-cols-3 md:gap-8"
            >
              <TabsTrigger
                value="about"
                className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="my-apartments"
                className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
              >
                My Apartments
              </TabsTrigger>
              <TabsTrigger
                value="my-issues"
                className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
              >
                My Issues
              </TabsTrigger>
              <TabsTrigger
                value="my-reports"
                className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
              >
                My Reports
              </TabsTrigger>
              <TabsTrigger
                value="assigned-issues"
                className="h3-semibold tab w-full rounded-lg px-6 py-2 text-center"
              >
                Assigned Issues
              </TabsTrigger>
            </TabsList>

            <div className="mt-20">
              <About />
              <Posts />
              <Apartments />
              <Issues />
              <Reports />
              <IssuesAsigned />
            </div>
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
