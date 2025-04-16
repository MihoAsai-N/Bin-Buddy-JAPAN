"use client"

import React from 'react';
import { signInWithEmailAndPassword, auth } from "../../../lib/firebaseConfig"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { NextPage } from "next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/admin/components/shadcn/ui/form"
import { useForm } from "react-hook-form"
import { Button } from "@/app/admin/components/shadcn/ui/button"
import { Input } from "@/app/admin/components/shadcn/ui/input"
import { FirebaseError } from "firebase/app"
import { Lock } from "lucide-react"
import BackToMainLink from "../../components/common/BackToMainLink"


type LoginForm = z.infer<typeof loginSchema>

const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
})

const Page: NextPage = () => {
  const router = useRouter()

  async function onSubmit(values: LoginForm) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.username, values.password)
      console.log("ログイン成功:", userCredential.user)
      router.push("/admin/dashboard") 
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert("ログイン失敗: " + error.message)
      } else {
        alert("不明なエラーが発生しました")
      }
    }
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  return (
    <div className="flex min-h-screen flex-col text-[#4a5568]">
      <BackToMainLink />
      <main className="flex-1 flex items-center justify-center py-12 bg-[#f0f5f8]">
        <div className="mx-auto grid w-full max-w-md gap-6 px-4">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex items-center justify-center">
              <Image
                src="/BinBuddy_Logo.png"
                alt="BinBuddy Logo"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#2d3748]">管理者ログイン</h1>
            <p className="text-left text-[#4a5568]">BinBuddy管理システムにアクセスするには、認証情報を入力してください。</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2d3748]">ユーザー名</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@binbuddy.jp" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2d3748]">パスワード</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-[#78B9C6] hover:bg-[#6aaab7] text-white">
                  <Lock className="mr-2 h-4 w-4" />
                  ログイン
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm text-[#4a5568]">
            <p className="text-left">パスワードをお忘れの場合は、システム管理者にお問い合わせください。</p>
            <p className="mt-2">
              アカウントをお持ちでない場合は、
              <Link href="/admin/register" className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline">
                新規登録
              </Link>
              してください。
            </p>
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

export default Page
