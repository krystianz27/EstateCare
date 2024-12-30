import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { openSans, robotoSlab } from "@/lib/font";
import { ThemeProvider } from "@/components/theme-provider";
import ReduxProvider from "@/lib/redux/provider";

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
      <body className={`${openSans.variable} ${robotoSlab.variable}`}>
        <ReduxProvider>
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
