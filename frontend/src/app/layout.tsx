// layout.tsx
import React from 'react';
import { NavLinks } from "./components/nav-links";
import { SideNavigation } from "./components/side-navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../app/components/theme-provider";
import { LanguageProvider } from "../app/contexts/language-context";
import { TrashProvider } from "../app/contexts/trash-context";
import { VisionProvider } from "../app/contexts/vision-context"; // VisionProvider をインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bin Buddy Japan - ゴミ分別アプリ",
  description: "日本のゴミ分別をサポートするアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <TrashProvider>
              <VisionProvider> {/* VisionProvider を追加 */}
                <div className="flex min-h-screen bg-gray-100">
                  <SideNavigation />
                  <main className="flex-1 flex justify-center pb-14 lg:pb-0">
                    <div className="w-full bg-white shadow-md">{children}</div>
                    {/* <NavLinks /> */}
                  </main>
                </div>
              </VisionProvider>
            </TrashProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
