"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/app/admin/components/common/AdminHeader"
import Sidebar from "@/app/admin/components/common/Sidebar"
import { Calendar, Settings } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/app/admin/components/shadcn/ui/tabs"
import { Button } from "@/app/admin/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/admin/components/shadcn/ui/card"
import { Input } from "@/app/admin/components/shadcn/ui/input"
import { Label } from "@/app/admin/components/shadcn/ui/label"
import { Checkbox } from "@/app/admin/components/shadcn/ui/checkbox"

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

export default function SettingsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("settings")

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

        {/* コンテンツ */}
        <main className="p-6 flex-1 space-y-6 overflow-auto">
          <h2 className="text-2xl font-bold text-[#2d3748]">管理者設定</h2>

          {/* 自治体情報カード */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>自治体情報</CardTitle>
              <CardDescription>自治体の基本情報を確認・編集できます。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { id: "municipalityCode", label: "地方公共団体コード", value: ADMIN_INFO.municipalityCode },
                  { id: "municipalityName", label: "自治体名", value: ADMIN_INFO.municipalityName },
                  { id: "furigana", label: "フリガナ", value: ADMIN_INFO.furigana },
                  { id: "postalCode", label: "郵便番号", value: ADMIN_INFO.postalCode },
                  { id: "address", label: "住所", value: ADMIN_INFO.address },
                  { id: "department", label: "担当部署", value: ADMIN_INFO.department },
                  { id: "contactPerson", label: "担当者名", value: ADMIN_INFO.contactPerson },
                  { id: "phoneNumber", label: "電話番号", value: ADMIN_INFO.phoneNumber },
                  { id: "email", label: "メールアドレス", value: ADMIN_INFO.email, type: "email" },
                ].map(({ id, label, value, type = "text" }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Input id={id} type={type} defaultValue={value} />
                  </div>
                ))}
                <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">変更を保存</Button>
              </div>
            </CardContent>
          </Card>

          {/* パスワード変更カード */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>パスワード変更</CardTitle>
              <CardDescription>アカウントのパスワードを変更します。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">現在のパスワード</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">新しいパスワード</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">パスワードを変更</Button>
              </div>
            </CardContent>
          </Card>

          {/* 通知設定カード */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>システムからの通知設定を管理します。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "email-notifications", label: "メール通知を受け取る" },
                  { id: "schedule-updates", label: "スケジュール更新の通知" },
                  { id: "system-updates", label: "システム更新の通知" },
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox id={id} defaultChecked />
                    <Label htmlFor={id}>{label}</Label>
                  </div>
                ))}
                <Button className="mt-4 bg-[#78B9C6] hover:bg-[#6aaab7]">設定を保存</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
