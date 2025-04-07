import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "../globals.css";
import { cn } from "../lib/utils";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Admin Area",
  description: "Admin panel",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "flex min-h-screen flex-col items-center justify-center",
        "bg-gradient-to-t from-[#78B9C6] via-[#a9d3db] to-[#e1f2f5]",
        "px-12 py-8",
        notoSansJP.variable
      )}
    >
      <main className="w-full max-w-none">{children}</main>
    </div>
  );
}
