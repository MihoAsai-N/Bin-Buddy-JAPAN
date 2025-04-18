"use client"

import React from 'react';
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BackToMainLinkProps {
  href?: string
  label?: string
}

export default function BackToMainLink({
  href = "/admin",
  label = "メインページに戻る",
}: BackToMainLinkProps) {
  return (
    <div className="container flex h-16 items-center">
      <Link href={href} className="flex items-center gap-2 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </div>
  )
}
