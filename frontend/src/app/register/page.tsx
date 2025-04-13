"use client"


import React from 'react';
import { Navigation } from "../components/navigation"
import { useLanguage } from "../contexts/language-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"

export default function RegisterPage() {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで登録処理を実装
    alert("登録処理をここに実装します")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("register.title")}</CardTitle>
            <CardDescription>{t("register.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("register.name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("register.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("register.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("register.confirm")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  {t("register.submit")}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="font-medium">{t("register.price")}</p>
            <p className="mt-2 font-medium">{t("register.features")}</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>{t("register.feature.1")}</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>{t("register.feature.2")}</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>{t("register.feature.3")}</span>
              </li>
            </ul>
          </CardFooter>
        </Card>

        <div className="text-xs text-gray-500 text-center mt-4">{t("common.copyright")}</div>
      </div>
    </div>
  )
}
