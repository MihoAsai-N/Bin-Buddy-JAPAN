"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/app/admin/components/shadcn/ui/tabs"
import { Calendar, Settings } from "lucide-react"
import Sidebar from "@/app/admin/components/common/Sidebar"
import AdminHeader from "@/app/admin/components/common/AdminHeader" // ✅ 追加

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("schedules")

  const { data: adminInfo, error, isLoading } = useSWR("/api/admin-info", fetcher)
  
  useEffect(() => {
    if (selectedTab === "settings") {
      router.push("/admin/dashboard/settings")
    } else if (selectedTab === "schedules") {
      router.push("/admin/dashboard/schedules")
    }
  }, [selectedTab, router])

if (isLoading) return <p className="p-6">読み込み中...</p>
if (error || !adminInfo) return <p className="p-6 text-red-500">管理者情報の取得に失敗しました</p>

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
          contactPerson={adminInfo.contactPerson}
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
