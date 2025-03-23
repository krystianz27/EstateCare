import LeftNavbar from "@/components/shared/navbar/LeftNavbar";
import Navbar from "@/components/shared/navbar/Navbar";
import React, { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <main className="bg-baby_veryBlack relative">
        <Navbar />
        <div className="flex">
          <LeftNavbar />
          <section className="flex min-h-screen flex-1 flex-col px-4 pb-6 pt-24 sm:px-6 lg:px-8 lg:pt-32">
            {children}
          </section>
        </div>
      </main>
    </Suspense>
  );
};

export default Layout;
