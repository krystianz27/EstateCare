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
      <div className="grid items-start gap-4 rounded-3xl py-4 max-md:my-2 md:gap-6 md:px-6 dark:bg-zinc-900">
        <Header />

        <div className="w-full">
          <Tabs
            className="dark:border-eerieBlack space-y-6 rounded-lg border"
            defaultValue="about"
          >
            <TabsList
              className="bg-baby_rich mb-6 grid min-h-40 grid-cols-2 gap-4 rounded-lg  px-4 
              py-3 max-md:min-h-48 sm:gap-6 md:grid-cols-2 md:gap-4"
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
      <div className="mt-6 grid w-full grid-cols-1 gap-4 rounded-3xl p-6 md:grid-cols-2 xl:grid-cols-2 dark:bg-zinc-900">
        <Link href="/profile/edit">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full min-w-full max-w-xs rounded-lg bg-zinc-800 text-white sm:w-64">
            Update Profile
          </Button>
        </Link>
        <Link href="/apartment/add">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full min-w-full max-w-xs rounded-lg bg-zinc-800 text-white sm:w-64">
            Add Your Apartment
          </Button>
        </Link>
        <Link href="/documents">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full min-w-full max-w-xs rounded-lg bg-zinc-800 text-white sm:w-64">
            Check Your Documents
          </Button>
        </Link>
        <Link href="/payments">
          <Button className="h3-semibold dark:bg-amber dark:text-amberText w-full min-w-full max-w-xs rounded-lg bg-zinc-800 text-white sm:w-64">
            Payment
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
