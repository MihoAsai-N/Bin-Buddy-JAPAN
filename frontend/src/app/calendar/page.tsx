"use client"

import { Navigation } from "../components/navigation"
import { Button } from "../components/ui/button"
import { useState } from "react"
import { Edit } from "lucide-react"
import { useLanguage } from "../contexts/language-context"
import { useRouter } from "next/navigation"
import { useTrash, type TrashType, type WeekDay } from "../contexts/trash-context"
import { Trash2, Recycle, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

// 曜日の数値を取得する関数（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
const getDayOfWeek = (day: WeekDay): number => {
  const days: { [key in WeekDay]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }
  return days[day]
}

// 数値から曜日を取得する関数
const getWeekdayFromNumber = (num: number): WeekDay => {
  const weekdays: WeekDay[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  return weekdays[num]
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 7, 17)) // 8月17日
  const { t, language } = useLanguage()
  const router = useRouter()
  const { region, getCollectionDays, getTrashTypesForWeekday } = useTrash()

  // 月の最初の日と最後の日を取得
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const dayOfWeek = firstDay.getDay()

    // 前月の日を追加
    for (let i = 0; i < dayOfWeek; i++) {
      days.push({ day: null, current: false, trashTypes: [] })
    }

    // 当月の日を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      const dayOfWeek = date.getDay()

      // この日に収集されるゴミの種類を取得
      const weekday = getWeekdayFromNumber(dayOfWeek)
      const trashTypes = getTrashTypesForWeekday(weekday)

      days.push({
        day: i,
        current: true,
        selected: i === selectedDate.getDate(),
        trashTypes: trashTypes,
      })
    }

    return days
  }

  const days = generateCalendarDays()
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"]

  // カメラ起動ボタンのクリックハンドラ
  const handleCameraLaunch = () => {
    router.push("/scan")
  }

  // 日付のフォーマット
  const formatDate = (date: Date) => {
    if (language === "ja") {
      return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, "0")}月${date.getDate().toString().padStart(2, "0")}日`
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date)
    }
  }

  // ゴミの種類に応じたアイコンを取得
  const getTrashIcon = (trashType: TrashType) => {
    switch (trashType) {
      case "burnable":
        return <Trash2 className="h-3 w-3 text-orange-500" />
      case "non-burnable":
        return <Trash2 className="h-3 w-3 text-blue-500" />
      case "recyclable":
        return <Recycle className="h-3 w-3 text-green-500" />
      case "hazardous":
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  // ゴミの種類の名前を取得
  const getTrashName = (trashType: TrashType) => {
    return t(`result.${trashType}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 p-4 flex flex-col space-y-4">
        <div className="bg-blue-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-gray-500">{t("calendar.select.date")}</div>
            <div className="text-xs text-orange-500 border border-orange-500 rounded-full px-2 py-0.5">
              {t("calendar.calendar")}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="font-bold">
              {language === "ja"
                ? `${selectedDate.getMonth() + 1}月 ${selectedDate.getDate()}日`
                : `${new Intl.DateTimeFormat("en-US", { month: "short" }).format(selectedDate)} ${selectedDate.getDate()}`}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-gray-500 mb-2">
            {language === "ja"
              ? `${selectedDate.getFullYear()}年 ${selectedDate.getMonth() + 1}月`
              : `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(selectedDate)} ${selectedDate.getFullYear()}`}
          </div>

          <TooltipProvider>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {weekdays.map((day, i) => (
                <div key={i} className="py-1">
                  {day}
                </div>
              ))}

              {days.map((day, i) => (
                <div
                  key={i}
                  className={`relative py-1 px-0 h-8 flex flex-col items-center justify-start ${
                    day.selected ? "bg-blue-500 text-white rounded-full" : ""
                  } ${!day.current ? "text-gray-300" : ""}`}
                >
                  <span className="mb-1">{day.day}</span>

                  {day.current && day.trashTypes && day.trashTypes.length > 0 && (
                    <div className="flex justify-center space-x-0.5 mt-auto">
                      {day.trashTypes.map((trashType, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div>{getTrashIcon(trashType)}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getTrashName(trashType)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TooltipProvider>

          {/* カレンダーの凡例 */}
          <div className="mt-4 pt-2 border-t border-blue-200">
            <div className="text-xs text-gray-600 mb-1">
              {language === "ja" ? "ゴミ収集日の凡例:" : "Trash Collection Legend:"}
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <Trash2 className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs">{t("result.burnable")}</span>
              </div>
              <div className="flex items-center">
                <Trash2 className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs">{t("result.non.burnable")}</span>
              </div>
              <div className="flex items-center">
                <Recycle className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs">{t("result.recyclable")}</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs">{t("result.hazardous")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="text-gray-500 mb-4">{t("calendar.take.photo")}</div>

          <Button className="bg-orange-500 hover:bg-orange-700 text-white px-6 text-xs" onClick={handleCameraLaunch}>
            {t("calendar.launch.camera")}
          </Button>
        </div>

        <div className="bg-gray-200 rounded-lg p-4">
          <div className="text-center mb-2 font-bold">{t("calendar.result")}</div>
          <div className="text-center mb-2">{formatDate(new Date(2023, 7, 8))}</div>
          <div className="text-center">{t("calendar.trash.type")}</div>
        </div>

        <div className="text-xs text-gray-500 text-center mt-auto">{t("common.copyright")}</div>
      </div>
    </div>
  )
}

