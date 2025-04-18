"use client";

import React from 'react';
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/admin/components/shadcn/ui/tabs";
import { Calendar, Settings } from "lucide-react";
import Sidebar from "@/app/admin/components/common/Sidebar";
import AdminHeader from "@/app/admin/components/common/AdminHeader"; // ✅ 追加

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("schedules");

  const {
    data: adminInfo,
    error,
    isLoading,
  } = useSWR("/api/admin-info", fetcher);

  useEffect(() => {
    if (selectedTab === "settings") {
      router.push("/admin/dashboard/settings");
    } else if (selectedTab === "schedules") {
      router.push("/admin/dashboard/schedules");
    }
  }, [selectedTab, router]);

  if (isLoading) return <p className="p-6">読み込み中...</p>;
  if (error || !adminInfo)
    return <p className="p-6 text-red-500">管理者情報の取得に失敗しました</p>;

  const handleLogout = () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      router.push("/admin/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f5f8] text-[#4a5568]">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex flex-1 flex-col">
        <AdminHeader
          contactPerson={adminInfo.contactPerson}
          onSettingsClick={() => setSelectedTab("settings")}
          onLogout={handleLogout}
        />

        {/* 決済ステータス表示欄 */}
        <div className="bg-white px-6 py-4 border-b">
          <p className="text-sm">
            決済ステータス：{" "}
            <span
              className={`font-semibold ${
                adminInfo.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {adminInfo.paymentStatus === "paid" ? "支払い済み" : "未払い"}
            </span>
          </p>
        </div>

        {/* モバイル用タブ */}
        <div className="border-b bg-white p-2 md:hidden">
          <Tabs
            value={selectedTab}
            onValueChange={(val) => {
              if (val === "schedules" && adminInfo.paymentStatus === "unpaid")
                return;
              setSelectedTab(val);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="schedules"
                disabled={adminInfo.paymentStatus === "unpaid"}
                className={
                  adminInfo.paymentStatus === "unpaid"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <Calendar className="mr-2 h-4 w-4" />
                収集スケジュール
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                管理者設定
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* 決済案内メッセージ */}
          {adminInfo.paymentStatus === "unpaid" && (
            <p className="text-sm text-red-600 mt-2">
              ※ご利用には決済が必要です。設定ページからお支払いを完了してください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
