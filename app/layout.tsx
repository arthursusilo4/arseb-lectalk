import type { Metadata } from "next";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Bricolage_Grotesque, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LecTalk",
  description: "Real-time AI Teaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body className={`${robotoSlab.variable} antialiased`}>
        <ClerkProvider appearance={{ variables: { colorPrimary: "#ffffff" } }}>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
    
  );
}