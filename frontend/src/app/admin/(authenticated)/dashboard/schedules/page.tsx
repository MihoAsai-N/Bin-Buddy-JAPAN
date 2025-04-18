"use client";

import React from 'react';
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import AdminHeader from "@/app/admin/components/common/AdminHeader";
import Sidebar from "@/app/admin/components/common/Sidebar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/admin/components/shadcn/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/admin/components/shadcn/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import { Calendar, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/admin/components/shadcn/ui/select";
import { Label } from "@/app/admin/components/shadcn/ui/label";
import { Textarea } from "@/app/admin/components/shadcn/ui/textarea";

export default function SchedulesPageWrapper() {
  // データ型定義
  type District = { id: string; name: string };
  type Area = { id: string; districtId: string; name: string };
  type GarbageType = { id: string; name: string; color: string };
  type Schedule = {
    id: string;
    districtId: string;
    areaId: string;
    day: string;
    garbageTypeId: string;
  };
  type AdminInfo = {
    municipalityCode: string;
    municipalityName: string;
    furigana: string;
    postalCode: string;
    address: string;
    department: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    paymentStatus: "paid" | "unpaid";
    lastLogin: string;
  };

  // データ取得関数
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // SWRを使ってデータを取得
  const { data: districts } = useSWR<District[]>("http://localhost:8000/districts", fetcher);
  const { data: areas } = useSWR<Area[]>("http://localhost:8000/admin_areas", fetcher);
  const { data: garbageTypes } = useSWR<GarbageType[]>("http://localhost:8000/garbage-types", fetcher);
  const { data: schedules = [] } = useSWR<Schedule[]>("http://localhost:8000/schedules", fetcher);
  const { data: adminInfo } = useSWR<AdminInfo>("http://localhost:8000/admin-info", fetcher);

  const router = useRouter();

  // ステート定義
  const [selectedTab, setSelectedTab] = useState("schedules");
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
  const [selectedArea, setSelectedArea] = useState<string | undefined>();
  const [note, setNote] = useState("");

  // フィルター処理
  const filteredSchedules = schedules.filter(
    (schedule) =>
      (!selectedDistrict || schedule.districtId === selectedDistrict) &&
      (!selectedArea || schedule.areaId === selectedArea)
  );

  // 表示名取得関数
  const getGarbageTypeName = (id: string) => garbageTypes?.find((t) => t.id === id)?.name || "";
  const getGarbageTypeColor = (id: string) => garbageTypes?.find((t) => t.id === id)?.color || "";
  const getDistrictName = (id: string) => districts?.find((d) => d.id === id)?.name || "";
  const getAreaName = (id: string) => areas?.find((a) => a.id === id)?.name || "";

  // ログアウト処理
  const handleLogout = () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      router.push("/admin/login");
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#f0f5f8] text-[#4a5568]">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex flex-1 flex-col">
        <AdminHeader
          contactPerson={adminInfo?.contactPerson ?? ""}
          onSettingsClick={() => setSelectedTab("settings")}
          onLogout={handleLogout}
        />

        {/* モバイル用タブ */}
        <div className="border-b bg-white p-2 md:hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedules">
                <Calendar className="mr-2 h-4 w-4" />収集スケジュール
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />管理者設定
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* コンテンツ */}
        <main className="p-6 flex-1 space-y-6 overflow-auto">
          {/* 地域選択カード */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>地域選択</CardTitle>
              <CardDescription>
                スケジュールを表示・編集する地域を選択してください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* 地区セレクト */}
                <div className="space-y-2">
                  <Label htmlFor="district-select">地区</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="border border-[#78B9C6] focus:ring-2 focus:ring-[#78B9C6] focus:border-[#78B9C6] text-[#4a5568]">
                      <SelectValue placeholder="地区を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-[#4a5568]">
                      {districts?.map((district) => (
                        <SelectItem
                          key={district.id}
                          value={district.id}
                          className="data-[state=checked]:bg-[#e1f2f5] data-[state=checked]:text-[#78B9C6] hover:bg-[#f0f5f8]"
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* エリアセレクト */}
                <div className="space-y-2">
                  <Label htmlFor="area-select">エリア</Label>
                  <Select
                    value={selectedArea}
                    onValueChange={setSelectedArea}
                    disabled={!selectedDistrict}
                  >
                    <SelectTrigger className="border border-[#78B9C6] focus:ring-2 focus:ring-[#78B9C6] focus:border-[#78B9C6] text-[#4a5568]">
                      <SelectValue placeholder="エリアを選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-[#4a5568]">
                      {areas
                        ?.filter((a) => a.districtId === selectedDistrict)
                        .map((area) => (
                          <SelectItem
                            key={area.id}
                            value={area.id}
                            className="data-[state=checked]:bg-[#e1f2f5] data-[state=checked]:text-[#78B9C6] hover:bg-[#f0f5f8]"
                          >
                            {area.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 収集スケジュールテーブル */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>収集スケジュール</CardTitle>
              <CardDescription>
                {selectedDistrict && selectedArea
                  ? `${getDistrictName(selectedDistrict)} ${getAreaName(selectedArea)}のごみ収集スケジュール`
                  : selectedDistrict
                  ? `${getDistrictName(selectedDistrict)}のごみ収集スケジュール`
                  : "地区とエリアを選択してください"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSchedules.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>地区</TableHead>
                      <TableHead>エリア</TableHead>
                      <TableHead>曜日</TableHead>
                      <TableHead>ごみの種類</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{getDistrictName(schedule.districtId)}</TableCell>
                        <TableCell>{getAreaName(schedule.areaId)}</TableCell>
                        <TableCell>{schedule.day}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getGarbageTypeColor(schedule.garbageTypeId)}`}
                          >
                            {getGarbageTypeName(schedule.garbageTypeId)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          <button className="inline-flex items-center rounded-md border border-[#78B9C6] bg-white px-3 py-1 text-sm font-medium text-[#78B9C6] hover:bg-[#e1f2f5] transition">
                            編集
                          </button>
                          <button className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-50 transition">
                            削除
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-center text-gray-500">
                    {selectedDistrict && selectedArea
                      ? "この地域のスケジュールはまだ登録されていません。"
                      : "地区とエリアを選択してください。"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        {/* 備考欄カード */}
        <Card className="bg-white">
            <CardHeader>
              <CardTitle>備考欄（定期的でない収集）</CardTitle>
              <CardDescription>
                特別な収集予定などを入力すると、ユーザーに通知が行われます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例：5月3日は臨時の粗大ごみ収集日です。"
                className="min-h-[100px] border border-[#78B9C6] focus:ring-2 focus:ring-[#78B9C6]"
              />
            </CardContent>
          </Card>  
        </main>

        {/* 未払い時のオーバーレイ */}
        {adminInfo?.paymentStatus === "unpaid" && (
          <>
            <div className="absolute inset-0 bg-gray-300 bg-opacity-60 z-10 pointer-events-auto" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-white border border-red-300 rounded-lg shadow-lg p-6 max-w-md text-center">
                <p className="text-red-600 text-sm font-medium">
                  この機能をご利用いただくには決済が必要です。
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <a href="/admin/dashboard/settings" className="text-blue-600 underline">
                    管理者設定ページ
                  </a>{" "}
                  からお支払いを完了してください。
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}