"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/shadcn/ui/button"
import { Input } from "../../components/shadcn/ui/input"
import { Label } from "../../components/shadcn/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/shadcn/ui/card"
import BackToMainLink from "../../components/common/BackToMainLink"

export default function Register() {
  const [formData, setFormData] = useState({
    municipalityName: "",
    address: "",
    phoneNumber: "",
    contactPersonName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここに登録ロジックを実装
    console.log("登録データ:", formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col text-[#4a5568]">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            メインページに戻る
          </Link>
        </div>
        <main className="flex-1 flex items-center justify-center py-12 bg-[#f0f5f8]">
          <div className="mx-auto grid w-full max-w-md gap-6 px-4 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dbeaee]">
                <CheckCircle className="h-10 w-10 text-[#78B9C6]" />
              </div>
              <h1 className="text-2xl font-bold text-[#2d3748]">登録が完了しました</h1>
              <p className="text-[#4a5568]">
                BinBuddyへの登録ありがとうございます。確認メールを送信しましたので、メールボックスをご確認ください。
              </p>
              <Button asChild className="mt-4 bg-[#78B9C6] hover:bg-[#6aaab7]">
                <Link href="/admin">トップページに戻る</Link>
              </Button>
            </div>
          </div>
        </main>
        <footer className="border-t py-4">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-[#4a5568]">© 2025 BinBuddy株式会社. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col text-[#4a5568]">
      <BackToMainLink />
      <main className="flex-1 flex items-center justify-center py-12 bg-[#f0f5f8]">
        <div className="mx-auto w-full max-w-2xl px-4">
          <Card className="shadow-sm border-[#dbeaee]">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/BinBuddy_Logo.png"
                  alt="BinBuddy Logo"
                  width={150}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
              <CardTitle className="text-2xl text-[#2d3748]">自治体新規登録</CardTitle>
              <CardDescription className="text-[#4a5568]">
                BinBuddyサービスに自治体を登録して、地域のゴミ分別情報を提供しましょう。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="municipalityName">
                      自治体名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="municipalityName"
                      name="municipalityName"
                      placeholder="例：東京都渋谷区"
                      value={formData.municipalityName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      担当部署 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="例：環境政策部"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      担当者名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="例：水井 花子"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPersonName">
                      電話番号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactPersonName"
                      name="contactPersonName"
                      placeholder="例：03-1234-5678"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      メールアドレス <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="例：mizui@city.shibuya.tokyo.jp"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        パスワード <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        パスワード（確認） <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[#4a5568]">
                  <p>
                    <span className="text-red-500">*</span> は必須項目です
                  </p>
                </div>

                <Button type="submit" className="w-full bg-[#78B9C6] hover:bg-[#6aaab7]">
                  登録する
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-between gap-4">
              <p className="text-center text-sm text-[#4a5568]">
                登録することで、
                <Link href="#" className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline">
                  利用規約
                </Link>
                と
                <Link href="#" className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline">
                  プライバシーポリシー
                </Link>
                に同意したことになります。
              </p>
              <p className="text-center text-sm">
                すでにアカウントをお持ちですか？
                <Link href="/admin" className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline ml-1">
                  ログイン
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-[#4a5568]">© 2025 BinBuddy株式会社. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
