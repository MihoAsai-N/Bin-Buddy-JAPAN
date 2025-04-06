"use client"

import type React from "react"

import { Navigation } from "../app/components/navigation"
import { Button } from "../app/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../app/components/ui/accordion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "../app/contexts/language-context"
import { useTrash } from "../app/contexts/trash-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../app/components/ui/select"
import { Label } from "../app/components/ui/label"

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
      <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-xs bg-gray-200 rounded-lg p-6">
          <Accordion type="single" collapsible className="w-full" defaultValue="address">
            <AccordionItem value="address" className="border-none">
              <AccordionTrigger className="py-2 px-4 rounded-full bg-gray-500 text-white text-xs mx-auto w-auto">
                {t("main.address.setup")}
              </AccordionTrigger>
              <AccordionContent>
                <form className="space-y-3 mt-4" onSubmit={handleSearch}>
                  <div>
                    <Label htmlFor="prefecture">{t("main.prefecture")}</Label>
                    <Select onValueChange={setPrefecture} value={prefecture}>
                      <SelectTrigger id="prefecture">
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
                    <Label htmlFor="city">{t("main.city")}</Label>
                    <input
                      type="text"
                      id="city"
                      placeholder={t("main.city")}
                      className="w-full p-2 border rounded-md bg-white"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">{t("main.district")}</Label>
                    <input
                      type="text"
                      id="district"
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

        <div className="text-xs text-gray-500 text-center">{t("common.copyright")}</div>
      </div>
    </div>
  )
}

