
"use client"
import React from 'react';
import { Navigation } from "../app/components/navigation"
import { Button } from "../app/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../app/components/ui/accordion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "../app/contexts/language-context"
import { useTrash } from "../app/contexts/trash-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../app/components/ui/select"
import { Label } from "../app/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"


export default function Home() {
  const [prefecture, setPrefecture] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const router = useRouter()
  const { t } = useLanguage()
  const { setRegion } = useTrash()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // 地域を設定（実際のアプリではより詳細な地域コードを使用）
    if (prefecture === "東京都" || prefecture === "Tokyo") {
      setRegion("tokyo")
    } else if (prefecture === "大阪府" || prefecture === "Osaka") {
      setRegion("osaka")
    } else {
      setRegion("default")
    }

    router.push("/calendar")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* PC版のレイアウト - lg以上の画面サイズで表示 */}
        <Card className="w-full max-w-none rounded-none lg:block hidden">
          <CardHeader className="px-6">
            <CardTitle>{t("main.address.setup")}</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form className="space-y-4" onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prefecture-desktop">{t("main.prefecture")}</Label>
                  <Select onValueChange={setPrefecture} value={prefecture}>
                    <SelectTrigger id="prefecture-desktop">
                      <SelectValue placeholder={t("main.prefecture")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="東京都">東京都</SelectItem>
                      <SelectItem value="大阪府">大阪府</SelectItem>
                      <SelectItem value="神奈川県">神奈川県</SelectItem>
                      <SelectItem value="愛知県">愛知県</SelectItem>
                      <SelectItem value="福岡県">福岡県</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city-desktop">{t("main.city")}</Label>
                  <input
                    type="text"
                    id="city-desktop"
                    placeholder={t("main.city")}
                    className="w-full p-2 border rounded-md bg-white"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="district-desktop">{t("main.district")}</Label>
                  <input
                    type="text"
                    id="district-desktop"
                    placeholder={t("main.district")}
                    className="w-full p-2 border rounded-md bg-white"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  {t("main.search")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* タブレット版のレイアウト - md〜lg の画面サイズで表示 */}
        <Card className="w-full max-w-none rounded-none hidden md:block lg:hidden">
          <CardHeader className="px-6">
            <CardTitle>{t("main.address.setup")}</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form className="space-y-4" onSubmit={handleSearch}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="prefecture-tablet">{t("main.prefecture")}</Label>
                  <Select onValueChange={setPrefecture} value={prefecture}>
                    <SelectTrigger id="prefecture-tablet">
                      <SelectValue placeholder={t("main.prefecture")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="東京都">東京都</SelectItem>
                      <SelectItem value="大阪府">大阪府</SelectItem>
                      <SelectItem value="神奈川県">神奈川県</SelectItem>
                      <SelectItem value="愛知県">愛知県</SelectItem>
                      <SelectItem value="福岡県">福岡県</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city-tablet">{t("main.city")}</Label>
                  <input
                    type="text"
                    id="city-tablet"
                    placeholder={t("main.city")}
                    className="w-full p-2 border rounded-md bg-white"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="district-tablet">{t("main.district")}</Label>
                  <input
                    type="text"
                    id="district-tablet"
                    placeholder={t("main.district")}
                    className="w-full p-2 border rounded-md bg-white"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  {t("main.search")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* モバイル版のレイアウト - md未満の画面サイズで表示 */}
        <div className="w-full p-6 md:hidden">
          <Accordion type="single" collapsible className="w-full" defaultValue="address">
            <AccordionItem value="address" className="border-none">
              <AccordionTrigger className="py-2 px-4 rounded-full bg-gray-500 text-white text-xs mx-auto w-auto">
                {t("main.address.setup")}
              </AccordionTrigger>
              <AccordionContent>
                <form className="space-y-3 mt-4" onSubmit={handleSearch}>
                  <div>
                    <Label htmlFor="prefecture-mobile">{t("main.prefecture")}</Label>
                    <Select onValueChange={setPrefecture} value={prefecture}>
                      <SelectTrigger id="prefecture-mobile">
                        <SelectValue placeholder={t("main.prefecture")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="東京都">東京都</SelectItem>
                        <SelectItem value="大阪府">大阪府</SelectItem>
                        <SelectItem value="神奈川県">神奈川県</SelectItem>
                        <SelectItem value="愛知県">愛知県</SelectItem>
                        <SelectItem value="福岡県">福岡県</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city-mobile">{t("main.city")}</Label>
                    <input
                      type="text"
                      id="city-mobile"
                      placeholder={t("main.city")}
                      className="w-full p-2 border rounded-md bg-white"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district-mobile">{t("main.district")}</Label>
                    <input
                      type="text"
                      id="district-mobile"
                      placeholder={t("main.district")}
                      className="w-full p-2 border rounded-md bg-white"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="pt-2 flex justify-center">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                      {t("main.search")}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-xs text-gray-500 text-center py-4">{t("common.copyright")}</div>
      </div>
    </div>
  )
}
