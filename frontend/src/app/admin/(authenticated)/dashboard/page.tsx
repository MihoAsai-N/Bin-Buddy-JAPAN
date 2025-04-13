"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/app/admin/components/shadcn/ui/tabs"
import { Calendar, Settings } from "lucide-react"
import Sidebar from "@/app/admin/components/common/Sidebar"
import AdminHeader from "@/app/admin/components/common/AdminHeader" // ✅ 追加

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

export default function DashboardPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("schedules")

  useEffect(() => {
    if (selectedTab === "settings") {
      router.push("/admin/dashboard/settings")
    } else if (selectedTab === "schedules") {
      router.push("/admin/dashboard/schedules")
    }
  }, [selectedTab, router])

  const handleLogout = () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      router.push("/admin/login")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f0f5f8] text-[#4a5568]">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex flex-1 flex-col">
        <AdminHeader
          contactPerson={ADMIN_INFO.contactPerson}
          onSettingsClick={() => setSelectedTab("settings")}
          onLogout={handleLogout}
        />

        {/* モバイル用タブ */}
        <div className="border-b bg-white p-2 md:hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedules">
                <Calendar className="mr-2 h-4 w-4" />
                収集スケジュール
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                管理者設定
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
