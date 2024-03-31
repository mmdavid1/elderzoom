import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'react-datepicker/dist/react-datepicker.css'
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
  

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elder Zoom",
  description: "Elder for Zoom",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
      <body className={`${inter.className} bg-dark-2`}>{children}
      <Toaster />
      </body>
      </ClerkProvider>
    </html>
  );
}
