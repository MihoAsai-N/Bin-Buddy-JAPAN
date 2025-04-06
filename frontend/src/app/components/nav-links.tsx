"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "../contexts/language-context"

export function NavLinks() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const links = [
    { href: "/", label: t("common.main") },
    { href: "/calendar", label: t("common.calendar") },
    { href: "/scan", label: t("common.scan") },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm ${isActive ? "text-yellow-500 font-bold" : "text-gray-500"}`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

