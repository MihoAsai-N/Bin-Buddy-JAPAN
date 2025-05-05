"use client";

import React, { useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  auth,
} from "../../../lib/firebaseConfig";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/shadcn/ui/button";
import { Input } from "../../components/shadcn/ui/input";
import { ArrowLeft, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/shadcn/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/shadcn/ui/form";

import BackToMainLink from "../../components/common/BackToMainLink";
// import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./registerSchema";

export default function Register() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // 入力中にバリデーション
    defaultValues: {
      municipalityCode: "",
      municipalityName: "",
      furigana: "",
      postalCode: "",
      address: "",
      department: "",
      contactPersonName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    console.log("🧪 form errors:", form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log("🧪 onSubmit に入りました");
    try {
      // 1. Firebase Authentication に新規登録
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      console.log("登録成功:", user);

      // 2. FastAPI に管理者情報を送信
      const res = await fetch("http://localhost:8000/admin-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          municipalityCode: data.municipalityCode,
          municipalityName: data.municipalityName,
          furigana: data.furigana,
          postalCode: data.postalCode,
          address: data.address,
          department: data.department,
          contactPerson: data.contactPersonName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          lastLogin: new Date().toISOString(), // 現在時刻
          paymentStatus: "unpaid",
        }),
      });

      if (!res.ok) {
        throw new Error("FastAPIへの登録に失敗しました");
      }

      const result = await res.json();
      console.log("FastAPI 登録成功:", result);

      setIsSubmitted(true);
    } catch (error: unknown) {
      console.error("🧪 catchブロック入りました:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error &&
        (error as { code: string }).code === "auth/email-already-in-use"
      ) {
        const err = error as { message: string };
        alert("登録に失敗しました: " + err.message);
      } else {
        console.error("予期しないエラー:", error);
        alert("予期しないエラーが発生しました");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col text-[#4a5568]">
        <div className="container flex h-16 items-center">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-medium"
          >
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
              <h1 className="text-2xl font-bold text-[#2d3748]">
                登録が完了しました
              </h1>
              <p className="text-[#4a5568]">
                BinBuddyへの登録ありがとうございます。
                <br />
                このまま <strong>決済ページ</strong>{" "}
                に進んで、利用を開始しましょう。
              </p>
              <div className="flex flex-col gap-4 mt-4 w-full">
                <Button
                  asChild
                  className="bg-[#78B9C6] hover:bg-[#6aaab7] w-full"
                >
                  <Link href="/admin/checkout">決済に進む</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin">トップページに戻る</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <footer className="border-t py-4">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-[#4a5568]">
              © 2025 BinBuddy株式会社. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col text-[#4a5568]">
      <BackToMainLink />
      <main className="flex-1 flex items-center justify-center py-12 bg-[#f0f5f8]">
        <div className="mx-auto w-full max-w-2xl px-4">
          <Card className="bg-white shadow-sm border-[#dbeaee]">
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
              <CardTitle className="text-2xl text-[#2d3748]">
                自治体新規登録
              </CardTitle>
              <CardDescription className="text-[#4a5568]">
                BinBuddyサービスに自治体を登録して、地域のゴミ分別情報を提供しましょう。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="municipalityCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            地方公共団体コード{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="municipalityCode"
                              placeholder="例：131130"
                              {...field}
                              onBlur={async (e) => {
                                field.onBlur(); // Hook Form の内部状態も維持

                                const code = e.target.value;
                                if (code.length === 6) {
                                  try {
                                    const res = await fetch(
                                      `http://localhost:8000/municipalities/${code}`
                                    );
                                    if (!res.ok)
                                      throw new Error("存在しないコードです");
                                    const data = await res.json();

                                    // 補完された値をformに反映（setValueで直接反映）
                                    form.setValue(
                                      "municipalityName",
                                      data.municipalityName
                                    );
                                    form.setValue("furigana", data.furigana);
                                    form.setValue(
                                      "postalCode",
                                      data.postalCode
                                    );
                                    form.setValue("address", data.address);
                                  } catch (err) {
                                    console.error("補完失敗:", err);
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="municipalityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            自治体名 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="municipalityName"
                              placeholder="例：東京都渋谷区"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="furigana"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            フリガナ <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="furigana"
                              placeholder="例：トウキョウトシブヤク"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            郵便番号 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="postalCode"
                              placeholder="例：150-8010"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            住所 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="address"
                              placeholder="例：東京都渋谷区宇田川町1-1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            担当部署 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="department"
                              placeholder="例：環境政策部"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            担当者名 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="contactPersonName"
                              placeholder="例：山田 太郎"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            電話番号 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="phoneNumber"
                              placeholder="例：03-1234-5678"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            メールアドレス{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="例：yamada@city.shibuya.tokyo.jp"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">
                            パスワード <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id="password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="confirmPassword">
                            パスワード（確認）{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="confirmPassword"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-sm text-[#4a5568]">
                    <p>
                      <span className="text-red-500">*</span> は必須項目です
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#78B9C6] hover:bg-[#6aaab7]"
                  >
                    登録する
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-between gap-4">
              <p className="text-center text-sm text-[#4a5568]">
                登録することで、
                <Link
                  href="#"
                  className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline"
                >
                  利用規約
                </Link>
                と
                <Link
                  href="#"
                  className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline"
                >
                  プライバシーポリシー
                </Link>
                に同意したことになります。
              </p>
              <p className="text-center text-sm">
                すでにアカウントをお持ちですか？
                <Link
                  href="/admin"
                  className="text-[#78B9C6] hover:text-[#6aaab7] hover:underline ml-1"
                >
                  ログイン
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-[#4a5568]">
            © 2025 BinBuddy株式会社. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
