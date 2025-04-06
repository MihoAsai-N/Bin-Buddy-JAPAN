//layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { ThemeProvider } from "../app/components/theme-provider"
// import { NavLinks } from "../app/components/nav-links"
// import { LanguageProvider } from "../app/contexts/language-context"
// import { TrashProvider } from "../app/contexts/trash-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bin Buddy Japan - ゴミ分別アプリ",
  description: "日本のゴミ分別をサポートするアプリ",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <TrashProvider> */}
              <main className="min-h-screen bg-gray-100 flex justify-center pb-14">
                <div className="w-full max-w-md bg-white shadow-md">{children}</div>
                {/* <NavLinks /> */}
              </main>
            {/* </TrashProvider>
          </LanguageProvider>
        </ThemeProvider> */}
      </body>
    </html>
  )
}