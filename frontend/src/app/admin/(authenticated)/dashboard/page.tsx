"use client"

import { useState } from "react"
import { useEffect } from "react" 
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/app/admin/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/admin/components/shadcn/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/app/admin/components/shadcn/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/admin/components/shadcn/ui/select"
import { Input } from "@/app/admin/components/shadcn/ui/input"
import { Label } from "@/app/admin/components/shadcn/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/admin/components/shadcn/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/admin/components/shadcn/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/admin/components/shadcn/ui/dropdown-menu"
import { Bell, Calendar, ChevronDown, Edit, LogOut, MoreHorizontal, Plus, Settings, Trash2, User } from "lucide-react"

// サンプルデータ
const DISTRICTS = [
  { id: "1", name: "中央区" },
  { id: "2", name: "北区" },
  { id: "3", name: "東区" },
  { id: "4", name: "白石区" },
  { id: "5", name: "豊平区" },
]

const AREAS = [
  { id: "1", districtId: "1", name: "エリア①" },
  { id: "2", districtId: "1", name: "エリア②" },
  { id: "3", districtId: "1", name: "エリア③" },
  { id: "4", districtId: "2", name: "エリア①" },
  { id: "5", districtId: "2", name: "エリア②" },
]

const GARBAGE_TYPES = [
  { id: "1", name: "燃えるごみ", color: "bg-red-100 text-red-800" },
  { id: "2", name: "燃えないごみ", color: "bg-blue-100 text-blue-800" },
  { id: "3", name: "プラスチック", color: "bg-yellow-100 text-yellow-800" },
  { id: "4", name: "ビン・缶", color: "bg-green-100 text-green-800" },
  { id: "5", name: "ペットボトル", color: "bg-purple-100 text-purple-800" },
  { id: "6", name: "古紙", color: "bg-gray-100 text-gray-800" },
]

const DAYS_OF_WEEK = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"]

const INITIAL_SCHEDULES = [
  { id: "1", districtId: "1", areaId: "1", day: "月曜日", garbageTypeId: "1" },
  { id: "2", districtId: "1", areaId: "1", day: "水曜日", garbageTypeId: "3" },
  { id: "3", districtId: "1", areaId: "1", day: "金曜日", garbageTypeId: "4" },
  { id: "4", districtId: "1", areaId: "2", day: "火曜日", garbageTypeId: "1" },
  { id: "5", districtId: "1", areaId: "2", day: "木曜日", garbageTypeId: "2" },
]

// 管理者情報のサンプルデータを更新
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
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>()
  const [selectedArea, setSelectedArea] = useState<string | undefined>()
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSchedule, setCurrentSchedule] = useState<any>(null)
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    garbageTypeId: "",
  })

  useEffect(() => {
    if (selectedTab === "settings") {
      router.push("/admin/dashboard/settings")
    }
  }, [router, selectedTab])

  // 選択された地区に基づいてエリアをフィルタリング
  const filteredAreas = selectedDistrict ? AREAS.filter((area) => area.districtId === selectedDistrict) : []

  // 選択された地区とエリアに基づいてスケジュールをフィルタリング
  const filteredSchedules = schedules.filter(
    (schedule) =>
      (!selectedDistrict || schedule.districtId === selectedDistrict) &&
      (!selectedArea || schedule.areaId === selectedArea),
  )

  // スケジュールの追加
  const handleAddSchedule = () => {
    if (!selectedDistrict || !selectedArea || !newSchedule.day || !newSchedule.garbageTypeId) {
      alert("すべての項目を入力してください")
      return
    }

    const newId = (Math.max(...schedules.map((s) => Number.parseInt(s.id))) + 1).toString()
    const schedule = {
      id: newId,
      districtId: selectedDistrict,
      areaId: selectedArea,
      day: newSchedule.day,
      garbageTypeId: newSchedule.garbageTypeId,
    }

    setSchedules([...schedules, schedule])
    setNewSchedule({ day: "", garbageTypeId: "" })
    setIsAddDialogOpen(false)
  }

  // スケジュールの編集
  const handleEditSchedule = () => {
    if (!currentSchedule || !currentSchedule.day || !currentSchedule.garbageTypeId) {
      alert("すべての項目を入力してください")
      return
    }

    setSchedules(schedules.map((schedule) => (schedule.id === currentSchedule.id ? currentSchedule : schedule)))
    setIsEditDialogOpen(false)
  }

  // スケジュールの削除
  const handleDeleteSchedule = (id: string) => {
    if (confirm("このスケジュールを削除してもよろしいですか？")) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id))
    }
  }

  // ログアウト処理
  const handleLogout = () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      router.push("/admin/login")
    }
  }

  // ゴミの種類を名前で取得
  const getGarbageTypeName = (id: string) => {
    const garbageType = GARBAGE_TYPES.find((type) => type.id === id)
    return garbageType ? garbageType.name : ""
  }

  // ゴミの種類の色を取得
  const getGarbageTypeColor = (id: string) => {
    const garbageType = GARBAGE_TYPES.find((type) => type.id === id)
    return garbageType ? garbageType.color : ""
  }

  // 地区名を取得
  const getDistrictName = (id: string) => {
    const district = DISTRICTS.find((district) => district.id === id)
    return district ? district.name : ""
  }

  // エリア名を取得
  const getAreaName = (id: string) => {
    const area = AREAS.find((area) => area.id === id)
    return area ? area.name : ""
  }

  return (
    <div className="flex min-h-screen bg-[#f0f5f8] text-[#4a5568]">
      {/* サイドバー */}
      <div className="hidden w-64 flex-shrink-0 flex-col bg-white border-r md:flex">
        <div className="flex h-16 items-center justify-center border-b">
          <Image
            src="/BinBuddy_Logo.png"
            alt="BinBuddy Logo"
            width={120}
            height={50}
            className="h-8 w-auto"
          />
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
              onClick={() => setSelectedTab("schedules")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              収集スケジュール
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${selectedTab === "settings" ? "bg-[#dbeaee] text-[#78B9C6]" : ""}`}
              onClick={() => setSelectedTab("settings")}
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

      {/* メインコンテンツ */}
      <div className="flex flex-1 flex-col">
        {/* ヘッダー */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center md:hidden">
            <Image
              src="/BinBuddy_Logo.png"
              alt="BinBuddy Logo"
              width={120}
              height={50}
              className="h-8 w-auto"
            />
          </div>
          <h1 className="text-lg font-medium text-[#2d3748] hidden md:block">管理者ダッシュボード</h1>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#dbeaee] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#78B9C6]" />
                  </div>
                  <span className="hidden md:inline">{ADMIN_INFO.contactPerson}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedTab("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  設定
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

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

        {/* コンテンツエリア */}
        <main className="flex-1 overflow-auto p-6">
          {selectedTab === "schedules" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2d3748]">ごみ収集スケジュール管理</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">
                      <Plus className="mr-2 h-4 w-4" />
                      新規スケジュール
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新規スケジュールの追加</DialogTitle>
                      <DialogDescription>地域のごみ収集スケジュールを追加します。</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="district" className="text-right">
                          地区
                        </Label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={setSelectedDistrict}
                          disabled={!!selectedDistrict}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="地区を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {DISTRICTS.map((district) => (
                              <SelectItem key={district.id} value={district.id}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="area" className="text-right">
                          エリア
                        </Label>
                        <Select
                          value={selectedArea}
                          onValueChange={setSelectedArea}
                          disabled={!selectedDistrict || !!selectedArea}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="エリアを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredAreas.map((area) => (
                              <SelectItem key={area.id} value={area.id}>
                                {area.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day" className="text-right">
                          曜日
                        </Label>
                        <Select
                          value={newSchedule.day}
                          onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="曜日を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="garbageType" className="text-right">
                          ごみの種類
                        </Label>
                        <Select
                          value={newSchedule.garbageTypeId}
                          onValueChange={(value) => setNewSchedule({ ...newSchedule, garbageTypeId: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="ごみの種類を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {GARBAGE_TYPES.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        キャンセル
                      </Button>
                      <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]" onClick={handleAddSchedule}>
                        追加
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>地域選択</CardTitle>
                  <CardDescription>スケジュールを表示・編集する地域を選択してください。</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="district-select">地区</Label>
                      <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger>
                          <SelectValue placeholder="地区を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area-select">エリア</Label>
                      <Select value={selectedArea} onValueChange={setSelectedArea} disabled={!selectedDistrict}>
                        <SelectTrigger>
                          <SelectValue placeholder="エリアを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredAreas.map((area) => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                          <TableHead className="text-right">操作</TableHead>
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
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getGarbageTypeColor(
                                  schedule.garbageTypeId,
                                )}`}
                              >
                                {getGarbageTypeName(schedule.garbageTypeId)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog
                                open={isEditDialogOpen && currentSchedule?.id === schedule.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setCurrentSchedule(schedule)
                                  }
                                  setIsEditDialogOpen(open)
                                }}
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentSchedule(schedule)
                                        setIsEditDialogOpen(true)
                                      }}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      編集
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteSchedule(schedule.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      削除
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>スケジュールの編集</DialogTitle>
                                    <DialogDescription>ごみ収集スケジュールを編集します。</DialogDescription>
                                  </DialogHeader>
                                  {currentSchedule && (
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-district" className="text-right">
                                          地区
                                        </Label>
                                        <Input
                                          id="edit-district"
                                          value={getDistrictName(currentSchedule.districtId)}
                                          className="col-span-3"
                                          disabled
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-area" className="text-right">
                                          エリア
                                        </Label>
                                        <Input
                                          id="edit-area"
                                          value={getAreaName(currentSchedule.areaId)}
                                          className="col-span-3"
                                          disabled
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-day" className="text-right">
                                          曜日
                                        </Label>
                                        <Select
                                          value={currentSchedule.day}
                                          onValueChange={(value) =>
                                            setCurrentSchedule({
                                              ...currentSchedule,
                                              day: value,
                                            })
                                          }
                                        >
                                          <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {DAYS_OF_WEEK.map((day) => (
                                              <SelectItem key={day} value={day}>
                                                {day}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-type" className="text-right">
                                          ごみの種類
                                        </Label>
                                        <Select
                                          value={currentSchedule.garbageTypeId}
                                          onValueChange={(value) =>
                                            setCurrentSchedule({
                                              ...currentSchedule,
                                              garbageTypeId: value,
                                            })
                                          }
                                        >
                                          <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {GARBAGE_TYPES.map((type) => (
                                              <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                      キャンセル
                                    </Button>
                                    <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]" onClick={handleEditSchedule}>
                                      保存
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


