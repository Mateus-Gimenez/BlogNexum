import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlogNexum",
  description: "A blog platform built with Next.js and .NET",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-100`}>
        <Header />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
