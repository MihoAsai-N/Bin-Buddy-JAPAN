"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// ゴミの種類
export type TrashType = "burnable" | "non-burnable" | "recyclable" | "hazardous"

// 曜日
export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

// 地域ごとの収集日設定
type RegionSchedule = {
  [key in TrashType]: WeekDay[]
}

// 地域データ
const regionData: { [key: string]: RegionSchedule } = {
  tokyo: {
    burnable: ["monday", "thursday"],
    "non-burnable": ["wednesday"],
    recyclable: ["tuesday", "friday"],
    hazardous: ["saturday"],
  },
  osaka: {
    burnable: ["tuesday", "friday"],
    "non-burnable": ["thursday"],
    recyclable: ["monday", "wednesday"],
    hazardous: ["saturday"],
  },
  default: {
    burnable: ["monday", "thursday"],
    "non-burnable": ["wednesday"],
    recyclable: ["tuesday", "friday"],
    hazardous: ["saturday"],
  },
}

// ゴミの種類を判定するためのモックデータ
const trashItems: { [key: string]: TrashType } = {
  plastic_bottle: "recyclable",
  paper: "recyclable",
  food_waste: "burnable",
  glass: "non-burnable",
  battery: "hazardous",
  can: "recyclable",
  styrofoam: "burnable",
  light_bulb: "hazardous",
  ceramic: "non-burnable",
  metal: "non-burnable",
}

type TrashContextType = {
  region: string
  setRegion: (region: string) => void
  analyzeTrash: (item: string) => TrashType
  getCollectionDays: (trashType: TrashType) => WeekDay[]
  getTrashTypesForWeekday: (weekday: WeekDay) => TrashType[]
  trashResult: TrashType | null
  setTrashResult: (type: TrashType | null) => void
}

const TrashContext = createContext<TrashContextType | undefined>(undefined)

export function TrashProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<string>("default")
  const [trashResult, setTrashResult] = useState<TrashType | null>(null)

  // ゴミの種類を判定する関数
  const analyzeTrash = (item: string): TrashType => {
    // 実際のアプリでは画像認識APIなどを使用
    // ここではモックデータを使用
    return trashItems[item] || "burnable"
  }

  // 収集日を取得する関数
  const getCollectionDays = (trashType: TrashType): WeekDay[] => {
    const schedule = regionData[region] || regionData["default"]
    return schedule[trashType]
  }

  // 特定の曜日に収集されるゴミの種類を取得する関数
  const getTrashTypesForWeekday = (weekday: WeekDay): TrashType[] => {
    const schedule = regionData[region] || regionData["default"]
    const trashTypes: TrashType[] = []

    Object.entries(schedule).forEach(([trashType, weekdays]) => {
      if (weekdays.includes(weekday)) {
        trashTypes.push(trashType as TrashType)
      }
    })

    return trashTypes
  }

  return (
    <TrashContext.Provider
      value={{
        region,
        setRegion,
        analyzeTrash,
        getCollectionDays,
        getTrashTypesForWeekday,
        trashResult,
        setTrashResult,
      }}
    >
      {children}
    </TrashContext.Provider>
  )
}

// カスタムフック
export function useTrash() {
  const context = useContext(TrashContext)
  if (context === undefined) {
    throw new Error("useTrash must be used within a TrashProvider")
  }
  return context
}

