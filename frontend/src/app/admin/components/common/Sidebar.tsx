"use client"

import React from 'react';
import Image from "next/image"
import { User, Calendar, Settings, LogOut } from "lucide-react"
import { Button } from "@/app/admin/components/shadcn/ui/button"
import { useRouter } from "next/navigation"

interface SidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

const ADMIN_INFO = {
  municipalityCode: "01100",
  municipalityName: "札幌市",
  furigana: "サッポロシ",
  postalCode: "060-8611",
  address: "北海道札幌市中央区北1条西2丁目",
  department: "環境局 環境事業部",
  contactPerson: "水井 花子",
  phoneNumber: "123-4567-89",
  email: "admin@binbuddy.jp",
  lastLogin: "2023-04-10 09:30",
}

export default function Sidebar({ selectedTab, setSelectedTab }: SidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      router.push("/admin/login")
    }
  }

  return (
    <div className="hidden w-64 flex-shrink-0 flex-col bg-white border-r md:flex">
      <div className="flex h-16 items-center justify-center border-b">
        <Image src="/BinBuddy_Logo.png" alt="BinBuddy Logo" width={120} height={50} className="h-8 w-auto" />
      </div>
      <div className="flex flex-col p-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 h-16 w-16 rounded-full bg-[#dbeaee] flex items-center justify-center">
            <User className="h-8 w-8 text-[#78B9C6]" />
          </div>
          <h3 className="text-sm font-medium text-[#2d3748]">{ADMIN_INFO.municipalityName}</h3>
          <p className="text-xs text-[#4a5568]">{ADMIN_INFO.department}</p>
        </div>
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start ${selectedTab === "schedules" ? "bg-[#dbeaee] text-[#78B9C6]" : ""}`}
            onClick={() => {
                setSelectedTab("schedules")
                router.push("/admin/dashboard/schedules")
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            収集スケジュール
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${selectedTab === "settings" ? "bg-[#dbeaee] text-[#78B9C6]" : ""}`}
            onClick={() => {
                setSelectedTab("settings")
                router.push("/admin/dashboard/settings")
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            管理者設定
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </Button>
        </nav>
      </div>
    </div>
  )
}
