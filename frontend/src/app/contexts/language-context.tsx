"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ja" | "en"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  ja: {
    // ナビゲーション
    "app.title": "Bin Buddy Japan",
    "nav.region.settings": "地域の設定",
    "nav.user.registration": "ユーザー登録",
    "nav.support": "サポート",

    // メイン画面
    "main.address.setup": "住所を設定",
    "main.prefecture": "都道府県",
    "main.city": "市区町村",
    "main.district": "区市町村",
    "main.search": "検索する",

    // カレンダー画面
    "calendar.select.date": "日付を選択",
    "calendar.calendar": "カレンダー",
    "calendar.take.photo": "画像撮影",
    "calendar.launch.camera": "カメラを起動",
    "calendar.result": "判定結果",
    "calendar.trash.type": "捨てるゴミ",

    // スキャン画面
    "scan.take.photo": "ゴミを撮影してください",
    "scan.cancel": "やめる",
    "scan.processing": "処理中...",
    "scan.take.picture": "撮影する",
    "scan.retake": "撮り直す",
    "scan.analyze": "分析する",

    // 結果画面
    "result.title": "分別結果",
    "result.trash.type": "ゴミの種類:",
    "result.collection.day": "収集日:",
    "result.back.to.calendar": "カレンダーに戻る",


    "result.Combustible": "燃えるゴミ",
    "result.non.Combustible": "燃えないゴミ",
    "result.Bottles": "びん・缶・ペットボトル",
    "result.Plastic": "容器プラ",
    "result.Paper": "雑がみ",
    "result.Branches": "枝・葉・草",
    "result.Not": "収集なし",




    "result.monday": "月曜日",
    "result.tuesday": "火曜日",
    "result.wednesday": "水曜日",
    "result.thursday": "木曜日",
    "result.friday": "金曜日",
    "result.saturday": "土曜日",
    "result.sunday": "日曜日",

    // ユーザー登録画面
    "register.title": "ユーザー登録",
    "register.subtitle": "有料会員登録で全ての機能を利用できます",
    "register.name": "名前",
    "register.email": "メールアドレス",
    "register.password": "パスワード",
    "register.confirm": "パスワード（確認）",
    "register.submit": "登録する",
    "register.price": "月額料金: 500円",
    "register.features": "利用可能な機能:",
    "register.feature.1": "無制限のゴミ分別",
    "register.feature.2": "収集日のリマインダー",
    "register.feature.3": "地域別のゴミ分別ルール",

    // サポート画面
    "support.title": "サポート",
    "support.subtitle": "お困りですか？以下に質問を入力してください",
    "support.placeholder": "ここに質問を入力...",
    "support.send": "送信",
    "support.faq": "よくある質問",
    "support.faq.1.q": "アプリの使い方を教えてください",
    "support.faq.1.a":
      "住所を設定し、カレンダーでゴミ収集日を確認し、カメラでゴミを撮影すると分別方法を教えてくれます。",
    "support.faq.2.q": "有料会員の特典は何ですか？",
    "support.faq.2.a":
      "有料会員になると、無制限のゴミ分別、収集日のリマインダー、地域別のゴミ分別ルールなどの機能が利用できます。",

    // 共通
    "common.copyright": "©Bin Buddy",
    "common.main": "メイン",
    "common.calendar": "カレンダー",
    "common.scan": "ゴミを調べる",
  },
  en: {
    // Navigation
    "app.title": "Bin Buddy Japan",
    "nav.region.settings": "Region Settings",
    "nav.user.registration": "User Registration",
    "nav.support": "Support",

    // Main Screen
    "main.address.setup": "Set Address",
    "main.prefecture": "Prefecture",
    "main.city": "City",
    "main.district": "District",
    "main.search": "Search",

    // Calendar Screen
    "calendar.select.date": "Select date",
    "calendar.calendar": "Calendar",
    "calendar.take.photo": "Take Photo",
    "calendar.launch.camera": "Launch Camera",
    "calendar.result": "Result",
    "calendar.trash.type": "Trash Type",

    // Scan Screen
    "scan.take.photo": "Please take a photo of the trash",
    "scan.cancel": "Cancel",
    "scan.processing": "Processing...",
    "scan.take.picture": "Take Picture",
    "scan.retake": "Retake",
    "scan.analyze": "Analyze",

    // Result Screen
    "result.title": "Sorting Result",
    "result.trash.type": "Trash Type:",
    "result.collection.day": "Collection Day:",
    "result.back.to.calendar": "Back to Calendar",




    "result.Combustible": "Combustible Waste",
    "result.non.Combustible": "Non-Combustible Waste",
    "result.Bottles": "Bottles, Cans & PET",
    "result.Plastic": "Plastic Containers & Packaging",
    "result.Paper": "Miscellaneous Paper",
    "result.Branches": "Branches, Leaves & Grass",
    "result.Not": "Not Collected",



    "result.monday": "Monday",
    "result.tuesday": "Tuesday",
    "result.wednesday": "Wednesday",
    "result.thursday": "Thursday",
    "result.friday": "Friday",
    "result.saturday": "Saturday",
    "result.sunday": "Sunday",

    // Register Screen
    "register.title": "User Registration",
    "register.subtitle": "Subscribe to access all features",
    "register.name": "Name",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirm": "Confirm Password",
    "register.submit": "Register",
    "register.price": "Monthly fee: 500 JPY",
    "register.features": "Available features:",
    "register.feature.1": "Unlimited trash sorting",
    "register.feature.2": "Collection day reminders",
    "register.feature.3": "Region-specific sorting rules",

    // Support Screen
    "support.title": "Support",
    "support.subtitle": "Need help? Enter your question below",
    "support.placeholder": "Type your question here...",
    "support.send": "Send",
    "support.faq": "Frequently Asked Questions",
    "support.faq.1.q": "How do I use this app?",
    "support.faq.1.a":
      "Set your address, check the collection days on the calendar, and take a photo of your trash to get sorting instructions.",
    "support.faq.2.q": "What are the benefits of paid membership?",
    "support.faq.2.a":
      "Paid members get unlimited trash sorting, collection day reminders, and region-specific sorting rules.",

    // Common
    "common.copyright": "©Bin Buddy",
    "common.main": "Main",
    "common.calendar": "Calendar",
    "common.scan": "Scan Trash",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ja")

  // ブラウザのローカルストレージから言語設定を読み込む
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "ja" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // 言語を設定し、ローカルストレージに保存する
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // 翻訳関数
  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// カスタムフック
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

