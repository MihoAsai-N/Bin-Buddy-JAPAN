// trash-context.tsx
"use client";

import React from 'react';
import { createContext, useContext, useState } from "react";

// ゴミの種類
export type TrashType = "Combustible" | "Non-Combustible" | "Bottles" | "Plastic"|"Paper"|"Branches"|"Not Collected";

// 曜日
export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// 地域ごとの収集日設定
type RegionSchedule = {
  [key in TrashType]: WeekDay[]; // キーの型を TrashType に修正
};

// 地域データ
const regionData: { [key: string]: RegionSchedule } = {
  tokyo: {
    Combustible: ["monday", "thursday"],
    "Non-Combustible": ["wednesday"],
    Bottles: ["tuesday", "friday"],
    Plastic: ["saturday"],
  },
  osaka: {
    Combustible: ["tuesday", "friday"],
    "Non-Combustible": ["thursday"],
    Bottles: ["monday", "wednesday"],
    Plastic: ["saturday"],
  },
  default: {
    Combustible: ["monday", "thursday"],
    "Non-Combustible": ["wednesday"],
    Bottles: ["tuesday", "friday"],
    Plastic: ["saturday"],
  },
};

// ゴミの種類を判定するためのモックデータ
// const trashItems: { [key: string]: TrashType } = { // 型を TrashType に修正
//   plastic_bottle: "recyclable",
//   paper: "recyclable",
//   food_waste: "burnable",
//   glass: "non-burnable",
//   battery: "hazardous",
//   can: "recyclable",
//   styrofoam: "burnable",
//   light_bulb: "hazardous",
//   ceramic: "non-burnable",
//   metal: "non-burnable",
// };

type TrashContextType = {
  region: string;
  setRegion: (region: string) => void;
  analyzeTrash: (item: string) => TrashType;
  getCollectionDays: (trashType: TrashType) => WeekDay[];
  getTrashTypesForWeekday: (weekday: WeekDay) => TrashType[];
  trashResult: TrashType | null; // 型を TrashType に修正
  setTrashResult: (type: TrashType | null) => void; // 型を TrashType に修正
  visionResult: any; // 型を any に修正 (または適切なインターフェース)
  setVisionResult: (data: any) => void; // 型を any に修正 (または適切なインターフェース)
};

const TrashContext = createContext<TrashContextType | undefined>(undefined);

export function TrashProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<string>("default");
  const [trashResult, setTrashResult] = useState<TrashType | null>(null); // 型を TrashType に修正
  const [visionResult, setVisionResult] = useState<any>(null); // 型を any に修正 (または適切なインターフェース)

  // ゴミの種類を判定する関数
  // const analyzeTrash = (item: string): TrashType => {
  //   // 実際のアプリでは画像認識APIなどを使用
  //   // ここではモックデータを使用
  //   return trashItems[item] || "burnable";
  // };

  // 収集日を取得する関数
  const getCollectionDays = (trashType: TrashType): WeekDay[] => {
    const schedule = regionData[region] || regionData["default"];
    return schedule[trashType];
  };

  // 特定の曜日に収集されるゴミの種類を取得する関数
  const getTrashTypesForWeekday = (weekday: WeekDay): TrashType[] => {
    const schedule = regionData[region] || regionData["default"];
    const trashTypes: TrashType[] = [];

    Object.entries(schedule).forEach(([trashType, weekdays]) => {
      if (weekdays.includes(weekday)) {
        trashTypes.push(trashType as TrashType);
      }
    });

    return trashTypes;
  };

  return (
    <TrashContext.Provider
      value={{
        region,
        setRegion,
        // analyzeTrash,
        getCollectionDays,
        getTrashTypesForWeekday,
        trashResult,
        setTrashResult,
        visionResult,
        setVisionResult,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
}

// カスタムフック
export function useTrash() {
  const context = useContext(TrashContext);
  if (context === undefined) {
    throw new Error("useTrash must be used within a TrashProvider");
  }
  return context;
}