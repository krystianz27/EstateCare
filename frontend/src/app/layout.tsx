import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { openSans, robotoSlab } from "@/lib/font";
import { ThemeProvider } from "@/components/theme-provider";
import ReduxProvider from "@/lib/redux/provider";
import Toast from "@/components/shared/Toast";
import PersistAuth from "@/utils/persistAuth";

export const metadata: Metadata = {
  title: "Estate Care",
  description: "Extate Care Apartments ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${openSans.variable} ${robotoSlab.variable}`}
      >
        <Toast />
        <ReduxProvider>
          <PersistAuth />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
