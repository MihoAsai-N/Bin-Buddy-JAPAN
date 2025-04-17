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
  const storageKey = `calendarData_${area}`;
  const [calendarData, setCalendarData] = useState<
    { [key: string]: string | null }[] | null
  >(null);

  console.log("areaの値：", area);//TODO:確認後削除
  useEffect(() => {

    console.log("areaの値：", area);
    fetch(`/api?area=${encodeURIComponent(area || "")}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        console.log("API レスポンス:", data);
        if (data && data.success && data.data) {
          const newRecords = data.data;
          console.log("取得したデータレコード:", newRecords);

          // 現在の calendarData と新しい records を比較
          if (JSON.stringify(calendarData) !== JSON.stringify(newRecords)) {
            setCalendarData(newRecords);
          } else {
            console.log("データは変更されていません。");
          }
        } else {
          console.error("データの取得に失敗しました:", data);
        }
      })
      .catch((error) => {
        console.error("Fetch エラー:", error);
      });
  });

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
      {/* モバイル版のレイアウト */}
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
        <div className="bg-white p-4 mt-5">
          <VisionResult />
        </div>
      </div>
      <div>
        <NavLinks />
      </div>
    </div>
  );
}
//calendr/page.tsx

//↑↑スキャンから戻れるが、カレンダーの反映なし------------------------------------------------------------------------
//↓↓スキャンから戻れない409エラー------------------------------------------------------------------------
// "use client";

// import React, { useState, useEffect } from "react";
// import { Navigation } from "../components/navigation";
// import { Button } from "../components/ui/button";
// import { useLanguage } from "../contexts/language-context";
// import { useSearchParams } from "next/navigation";
// import { useTrash, WeekDay } from "../contexts/trash-context";
// import { TooltipProvider } from "../components/ui/tooltip";
// import { NavLinks } from "../components/nav-links";
// import { VisionResult } from "../components/VisionResult";
// import Legend from "../components/Legend";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import IrregularComment from "../components/IrregularComment";
// import { getGarbageDay } from "../lib/utils";
// import { getTrashIcon } from "./AddIcon";
// import { FcComments } from "react-icons/fc";

// // 数値から曜日を取得する関数
// const getWeekdayFromNumber = (num: number): WeekDay => {
//   const weekdays: WeekDay[] = [
//     "sunday",
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday",
//     "saturday",
//   ];
//   return weekdays[num];
// };

// const MAX_RETRIES = 3; // 最大再試行回数
// const RETRY_DELAY = 1000; // 再試行間隔 (ミリ秒)

// export default function CalendarPage() {
//   const [selectedDate] = useState(new Date());
//   const { t, language } = useLanguage();
//   const { getTrashTypesForWeekday } = useTrash();
//   const searchParams = useSearchParams();
//   const area = searchParams.get("area");
//   const storageKey = `calendarData_${area}`;
//   const [calendarData, setCalendarData] = useState<
//     { [key: string]: string | null }[] | null
//   >(null);
//   const [loading, setLoading] = useState(true); // ローディング状態
//   const [error, setError] = useState<string | null>(null); // エラーメッセージ
//   const [retryCount, setRetryCount] = useState(0);

//   console.log("areaの値：", area); //TODO:確認後削除

//   useEffect(() => {
//     const storedData = localStorage.getItem(storageKey);
//     if (storedData) {
//       try {
//         setCalendarData(JSON.parse(storedData));
//         setLoading(false); // localStorage からロード完了
//         console.log("localStorageからデータをロードしました:", JSON.parse(storedData));
//         return; // localStorage にデータがあれば API 呼び出しをスキップ
//       } catch (parseError) {
//         console.error("localStorageのデータ解析に失敗しました:", parseError);
//         // 解析失敗時は API を通常通り呼び出す
//       }
//     }

//     setLoading(true);
//     setError(null);
//  console.log(`areaの値：${area}, リトライ回数: ${retryCount}`);
//     fetch(`/api?area=${encodeURIComponent(area || "")}`, { cache: "no-store" })
//       .then((response) => {
//         if (!response.ok) {
//           if (response.status === 409 && retryCount < MAX_RETRIES) {
//             // 409 エラーかつ再試行回数上限未満の場合、再試行
//             console.log(`409エラー発生、${RETRY_DELAY}ms後に再試行します (${retryCount + 1}/${MAX_RETRIES})`);
//             setTimeout(() => {
//               setRetryCount((prevCount) => prevCount + 1);
//             }, RETRY_DELAY);
//           throw new Error(`HTTP error! status: ${response.status}, 再試行中...`);
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("API レスポンス:", data);
//         if (data && data.success && data.data) {
//           const newRecords = data.data;
//           console.log("取得したデータレコード:", newRecords);

//           // 現在の calendarData と新しい records を比較
//           if (JSON.stringify(calendarData) !== JSON.stringify(newRecords)) {
//             setCalendarData(newRecords);
//             // API からの新しいデータを localStorage に保存
//             try {
//               localStorage.setItem(storageKey, JSON.stringify(newRecords));
//               console.log("localStorageにデータを保存しました:", newRecords);
//             } catch (saveError) {
//               console.error("localStorageへの保存に失敗しました:", saveError);
//             }
//             setRetryCount(0);
//           } else {
//             console.log("データは変更されていません。");
//           }
//         } else {
//           setError("データの取得に失敗しました: APIレスポンスの形式が不正です。");
//         }
//       })
//       .catch((fetchError) => {
//         console.error("Fetch エラー:", fetchError);
//         setError(`データの取得に失敗しました: ${fetchError.message}`);
//         // API 失敗時に localStorage のデータをフォールバックとして使用
//         const storedDataOnError = localStorage.getItem(storageKey);
//         if (storedDataOnError) {
//           try {
//             setCalendarData(JSON.parse(storedDataOnError));
//             console.log("API失敗時: localStorageからデータをロードしました:", JSON.parse(storedDataOnError));
//             // 必要に応じてユーザーに古いデータである旨を通知する UI を追加する
//           } catch (parseError) {
//             console.error("API失敗時: localStorageのデータ解析に失敗しました:", parseError);
//             // それでも失敗した場合は、エラー状態を維持
//           }
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
      
//   }, [area, storageKey]); // 依存配列から calendarData を削除

//   // カレンダーの日付を生成
//   const generateCalendarDays = () => {
//     const year = selectedDate.getFullYear();
//     const month = selectedDate.getMonth();

//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);

//     const days = [];
//     const dayOfWeek = firstDay.getDay();

//     // 前月の日を追加
//     const prevMonthLastDay = new Date(year, month, 0).getDate();
//     for (let i = dayOfWeek - 1; i >= 0; i--) {
//       days.push({
//         day: prevMonthLastDay - i,
//         current: false,
//         trashTypes: [],
//         garbageDayValue: null,
//       });
//     }

//     // 当月の日を追加
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       const date = new Date(year, month, i);
//       const dayOfWeek = date.getDay();
//       console.log(dayOfWeek);

//       // この日に収集されるゴミの種類を取得
//       const weekday = getWeekdayFromNumber(dayOfWeek);
//       const trashTypes = getTrashTypesForWeekday(weekday);

//       // recordsからゴミの収集日を取得
//       console.log("calendarData:", calendarData);
//       const garbageDayValue = calendarData ? getGarbageDay(date, calendarData) : null;
//       console.log(
//         `日付: ${date.toISOString().slice(0, 10)}, ゴミ情報: ${garbageDayValue}`
//       );

//       days.push({
//         day: i,
//         current: true,
//         selected:
//           i === selectedDate.getDate() &&
//           selectedDate.getMonth() === month &&
//           selectedDate.getFullYear() === year,
//         trashTypes: trashTypes,
//         garbageDayValue: garbageDayValue,
//       });
//       console.log(days);
//     }

//     // 次月の日を追加
//     const remainingDays = 42 - days.length;
//     for (let i = 1; i <= remainingDays; i++) {
//       days.push({
//         day: i,
//         current: false,
//         trashTypes: [],
//         garbageDayValue: null,
//       });
//     }
//     return days;
//   };

//   const days = generateCalendarDays();
//   const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

//   if (loading) {
//     return <div>Loading calendar data...</div>;
//   }

//   if (error) {
//     return <div>Error loading calendar data: {error}</div>;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navigation />
//       {/* モバイル版のレイアウト */}
//       <div className="flex-1 flex flex-col space-y-4 mt-5">
//         <div className="bg-white p-4">
//           <div className="flex justify-between items-center">
//             <div className="text-lg font-bold mb-2">
//               {language === "ja"
//                 ? `${selectedDate.getFullYear()}年 ${
//                     selectedDate.getMonth() + 1
//                   }月`
//                 : `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(
//                     selectedDate
//                   )} ${selectedDate.getFullYear()}`}
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button>
//                   <FcComments className="h-5 w-5 mb-2" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="bg-white">
//                 <Legend />
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <div className="rounded-xl border border-[#cbe8ed] bg-white p-4 shadow-sm">
//             <TooltipProvider>
//               <div className="grid grid-cols-7 gap-1 text-center text-xs">
//                 {weekdays.map((day, i) => (
//                   <div key={i} className="py-1">
//                     {day}
//                   </div>
//                 ))}
//                 {days.map((day, i) => (
//                   <div
//                     key={i}
//                     className={`relative px-0 mb-1 py-0 pb-2 mt-2 h-14 flex flex-col items-center text-lg font-semibold justify-start ${
//                       day.selected ? "bg-[#cbe8ed] rounded-full" : ""
//                     } ${!day.current ? "text-gray-300" : ""}`}
//                   >
//                     <span className="mb-1">{day.day}</span>
//                     {day.current && day.garbageDayValue !== null && (
//                       <div className="flex flex-col items-center mt-auto">
//                         <div className="mt-1">
//                           {getTrashIcon(day.garbageDayValue)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </TooltipProvider>
//           </div>
//         </div>
//         <IrregularComment />
//         <div className="bg-white p-4 mt-5">
//           <VisionResult />
//         </div>
//       </div>
//       <div>
//         <NavLinks />
//       </div>
//     </div>
//   );
// }