"use client"

import React from 'react';
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "../contexts/language-context"
import { Home, Calendar, Camera } from "lucide-react"

export function NavLinks() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const links = [
    { href: "/scan", label: t("common.scan"), icon: <Camera className="h-5 w-5" /> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#cbe8ed] border-t flex justify-around">
      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center px-4 py-2 ${
              isActive ? "text-purple-600 font-bold" : " text-cyan-900 font-bold"
            }`}
          >
            {link.icon}
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
