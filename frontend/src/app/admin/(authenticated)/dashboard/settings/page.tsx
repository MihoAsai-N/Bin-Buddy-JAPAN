"use client";

import React from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import AdminHeader from "@/app/admin/components/common/AdminHeader";
import Sidebar from "@/app/admin/components/common/Sidebar";
import { Calendar, Settings } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/admin/components/shadcn/ui/tabs";
import { Button } from "@/app/admin/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/admin/components/shadcn/ui/card";
import { Input } from "@/app/admin/components/shadcn/ui/input";
import { Label } from "@/app/admin/components/shadcn/ui/label";
import { Checkbox } from "@/app/admin/components/shadcn/ui/checkbox";
import { mutate } from "swr";
import { useAuth } from "@/app/contexts/auth-context";
import { AdminInfo } from "@/types/admin";

const fetcher = (url: string) =>
  fetch(`http://localhost:8000${url}`).then((res) => res.json());

export default function SettingsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("settings");
  const { data: user } = useAuth();

  const {
    data: adminInfo,
    error,
    isLoading,
  } = useSWR(user ? `/admin-info?uid=${user.uid}` : null, fetcher);
  const [formData, setFormData] = useState<AdminInfo | null>(null);

  useEffect(() => {
    if (adminInfo) {
      setFormData(adminInfo);
    }
  }, [adminInfo]);

  const handleLogout = () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      router.push("/admin/login");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleSave = async () => {
    if (!user || !user.uid || !formData) {
      alert("ユーザー情報が見つかりません");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/admin-info?uid=${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      if (res.ok) {
        await mutate(`http://localhost:8000/admin-info?uid=${user.uid}`); //SWRのキャッシュ更新
        alert("保存しました");
      } else {
        alert("保存に失敗しました");
      }
    } catch (err) {
      alert("エラーが発生しました");
      console.error(err);
    }
  };

  if (isLoading) return <p className="p-6">読み込み中...</p>;
  if (error)
    return <p className="p-6 text-red-500">データの取得に失敗しました。</p>;

  return (
    <div className="flex min-h-screen bg-[#f0f5f8] text-[#4a5568]">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex flex-1 flex-col">
        {adminInfo ? (
          <AdminHeader
            contactPerson={adminInfo!.contactPerson}
            onSettingsClick={() => setSelectedTab("settings")}
            onLogout={handleLogout}
          />
        ) : (
          <div className="p-6">管理者情報を読み込み中...</div>
        )}

        {/* 決済ステータス表示欄 */}
        {adminInfo && (
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

            {adminInfo.paymentStatus === "unpaid" && (
              <Button
                onClick={() => router.push("/admin/checkout")}
                className="bg-[#78B9C6] hover:bg-[#6aaab7] px-4 py-2"
              >
                決済へ進む
              </Button>
            )}
          </div>
        )}
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
              <CardDescription>
                自治体の基本情報を確認・編集できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    id: "municipalityCode",
                    label: "地方公共団体コード",
                    value: adminInfo?.municipalityCode ?? "",
                  },
                  {
                    id: "municipalityName",
                    label: "自治体名",
                    value: adminInfo?.municipalityName ?? "",
                  },
                  {
                    id: "furigana",
                    label: "フリガナ",
                    value: adminInfo?.furigana ?? "",
                  },
                  {
                    id: "postalCode",
                    label: "郵便番号",
                    value: adminInfo?.postalCode ?? "",
                  },
                  {
                    id: "address",
                    label: "住所",
                    value: adminInfo?.address ?? "",
                  },
                  {
                    id: "department",
                    label: "担当部署",
                    value: adminInfo?.department ?? "",
                  },
                  {
                    id: "contactPerson",
                    label: "担当者名",
                    value: adminInfo?.contactPerson ?? "",
                  },
                  {
                    id: "phoneNumber",
                    label: "電話番号",
                    value: adminInfo?.phoneNumber ?? "",
                  },
                  {
                    id: "email",
                    label: "メールアドレス",
                    value: adminInfo?.email ?? "",
                    type: "email",
                  },
                ].map(({ id, label, type = "text" }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type={type}
                      value={
                        (formData?.[id as keyof AdminInfo] as string) || ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <Button
                  className="bg-[#78B9C6] hover:bg-[#6aaab7]"
                  onClick={handleSave}
                >
                  変更を保存
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 決済情報カード（paymentStatusが "paid" のときのみ表示） */}
          {adminInfo?.paymentStatus === "paid" && (
            <Card className="bg-white mt-6">
              <CardHeader>
                <CardTitle>決済情報</CardTitle>
                <CardDescription>
                  管理者アカウントの決済日および次回決済期限日を確認できます。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">決済日</Label>
                    <Input
                      id="paymentDate"
                      type="text"
                      readOnly
                      value={
                        adminInfo?.paymentDate
                          ? new Date(adminInfo.paymentDate).toLocaleDateString(
                              "ja-JP",
                            )
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextPaymentDue">次回決済期限日</Label>
                    <Input
                      id="nextPaymentDue"
                      type="text"
                      readOnly
                      value={
                        adminInfo?.paymentDate
                          ? new Date(
                              new Date(adminInfo.paymentDate).setFullYear(
                                new Date(adminInfo.paymentDate).getFullYear() +
                                  1,
                              ),
                            ).toLocaleDateString("ja-JP")
                          : ""
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* パスワード変更カード */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>パスワード変更</CardTitle>
              <CardDescription>
                アカウントのパスワードを変更します。
              </CardDescription>
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
                  <Label htmlFor="confirm-password">
                    新しいパスワード（確認）
                  </Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">
                  パスワードを変更
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 通知設定カード */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>
                システムからの通知設定を管理します。
              </CardDescription>
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
                <Button className="mt-4 bg-[#78B9C6] hover:bg-[#6aaab7]">
                  設定を保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
