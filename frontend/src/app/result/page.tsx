//TODO:削除
// "use client";
// import React from 'react';
// import { Navigation } from "../components/navigation";
// import { useLanguage } from "../contexts/language-context";
// import { Button } from "../components/ui/button";
// import { useRouter } from "next/navigation";
// import {
//   useTrash,
//   type WeekDay,
//   setTrashResult,
// } from "../contexts/trash-context"; // setTrashResult は不要になった可能性
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Trash2, Recycle, AlertTriangle, Calendar } from "lucide-react";
// import { useEffect } from "react"; // useEffect をインポート

// export default function ResultPage() {
//   const { t, language } = useLanguage();
//   const router = useRouter();
//   const {
//     trashResult,
//     getCollectionDays,
//     setTrashResult: setContextTrashResult,
//   } = useTrash(); // setTrashResult の名前を変更

//   // 結果がない場合はカレンダー画面にリダイレクト
//   useEffect(() => {
//     if (!trashResult) {
//       router.push("/calendar");
//     }
//   }, [trashResult, router]);

//   // trashResult が null の場合は何も表示しない
//   if (!trashResult) {
//     return null;
//   }

//   // 収集日を取得
//   const collectionDays = getCollectionDays(trashResult);

//   // ゴミの種類に応じたアイコンとカラーを取得
//   const getTrashIcon = () => {
//     switch (trashResult) {
//       case "burnable":
//         return <Trash2 className="h-12 w-12 text-orange-500" />;
//       case "non-burnable":
//         return <Trash2 className="h-12 w-12 text-blue-500" />;
//       case "recyclable":
//         return <Recycle className="h-12 w-12 text-green-500" />;
//       case "hazardous":
//         return <AlertTriangle className="h-12 w-12 text-red-500" />;
//       case "unknown":
//         return <AlertTriangle className="h-12 w-12 text-gray-500" />; // unknown の場合のアイコン
//       default:
//         return <Trash2 className="h-12 w-12 text-gray-500" />;
//     }
//   };

//   // 曜日を表示用にフォーマット
//   const formatWeekdays = (days: WeekDay[] | undefined | null) => {
//     if (!days || days.length === 0) {
//       return "";
//     }
//     return days.map((day) => t(`result.${day}`)).join("、");
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navigation />

//       <div className="flex-1 p-4">
//         <Card className="w-full">
//           <CardHeader className="text-center">
//             <CardTitle>{t("result.title")}</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center space-y-6">
//             <div className="flex flex-col items-center">
//               {getTrashIcon()}
//               <div className="mt-4 text-xl font-bold">
//                 {t(`result.${trashResult}`)}
//               </div>
//             </div>

//             <div className="w-full border-t border-b py-4 space-y-4">
//               <div className="flex items-center">
//                 <div className="font-medium mr-2">{t("result.trash.type")}</div>
//                 <div>{t(`result.${trashResult}`)}</div>
//               </div>

//               <div className="flex items-start">
//                 <div className="font-medium mr-2 flex items-center">
//                   <Calendar className="h-4 w-4 mr-1" />
//                   {t("result.collection.day")}
//                 </div>
//                 <div>{formatWeekdays(collectionDays)}</div>
//               </div>
//             </div>

//             <Button
//               className="bg-purple-600 hover:bg-purple-700 text-white"
//               onClick={() => router.push("/calendar")}
//             >
//               {t("result.back.to.calendar")}
//             </Button>
//           </CardContent>
//         </Card>

//         <div className="text-xs text-gray-500 text-center mt-4">
//           {t("common.copyright")}
//         </div>
//       </div>
//     </div>
//   );
// }
