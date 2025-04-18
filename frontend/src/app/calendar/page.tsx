//calendar/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "../components/navigation";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/language-context";
import {useSearchParams } from "next/navigation";
import {
  useTrash, WeekDay } from "../contexts/trash-context";
import { TooltipProvider} from "../components/ui/tooltip";
import { NavLinks } from "../components/nav-links";
import { VisionResult } from "../components/VisionResult";
import Legend from "../components/Legend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import IrregularComment from "../components/IrregularComment";
import { getGarbageDay } from "../lib/utils";
import { getTrashIcon } from "./AddIcon";
import { FcComments } from "react-icons/fc";
import { useRouter } from "next/router";

// 数値から曜日を取得する関数
const getWeekdayFromNumber = (num: number): WeekDay => {
  const weekdays: WeekDay[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return weekdays[num];
};

export default function CalendarPage() {
  const [selectedDate] = useState(new Date());
  const { t, language } = useLanguage();
  const { getTrashTypesForWeekday } = useTrash();
  // const [isLegendOpen] = useState(false);
  const searchParams = useSearchParams();
  const area = searchParams.get("area");
  const storageKey = `calendarData`;
  const [calendarData, setCalendarData] = useState<
    { [key: string]: string | null }[] | null
  >(null);

  console.log("areaの値：", area);//TODO:確認後削除  

  useEffect(() => {  
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setCalendarData(parsed);
      } catch (e) {
        console.error("localStorageのパースに失敗:", e);
      }
    }
  },[]);
  
  

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const dayOfWeek = firstDay.getDay();

    // 前月の日を追加
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        current: false,
        trashTypes: [],
        garbageDayValue: null,
      });
    }

    // 当月の日を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();
      console.log(dayOfWeek);

      // この日に収集されるゴミの種類を取得
      const weekday = getWeekdayFromNumber(dayOfWeek);
      const trashTypes = getTrashTypesForWeekday(weekday);

      // recordsからゴミの収集日を取得
      console.log("calendarData:", calendarData);
      const garbageDayValue = calendarData
        ? getGarbageDay(date, calendarData)
        : null;
      console.log(
        `日付: ${date.toISOString().slice(0, 10)}, ゴミ情報: ${garbageDayValue}`
      );

      days.push({
        day: i,
        current: true,
        selected:
          i === selectedDate.getDate() &&
          selectedDate.getMonth() === month &&
          selectedDate.getFullYear() === year,
        trashTypes: trashTypes,
        garbageDayValue: garbageDayValue,
      });
      console.log(days);
    }

    // 次月の日を追加
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        current: false,
        trashTypes: [],
        garbageDayValue: null,
      });
    }
    return days;
  };

  const days = generateCalendarDays();
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-1 flex flex-col space-y-4 mt-5">
        <div className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold mb-2">
              {language === "ja"
                ? `${selectedDate.getFullYear()}年 ${
                    selectedDate.getMonth() + 1
                  }月`
                : `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                    selectedDate
                  )} ${selectedDate.getFullYear()}`}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <FcComments className="h-5 w-5 mb-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <Legend />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-xl border border-[#cbe8ed] bg-white p-4 shadow-sm">
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
                    className={`relative px-0 mb-1 py-0 pb-2 mt-2 h-14 flex flex-col items-center text-lg font-semibold justify-start ${
                      day.selected ? "bg-[#cbe8ed] rounded-full" : ""
                    } ${!day.current ? "text-gray-300" : ""}`}
                  >
                    <span className="mb-1">{day.day}</span>

                    {day.current && day.garbageDayValue !== null && (
                      <div className="flex flex-col items-center mt-auto">
                        <div className="mt-1">
                          {getTrashIcon(day.garbageDayValue)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
        <IrregularComment />
        <div className="bg-white p-4 mt-10 mb-20 text-center">
          <VisionResult />
        </div>
      </div>
      <div>
        <NavLinks />
      </div>
    </div>
  );
}