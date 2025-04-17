"use client";

import React from 'react';

import {
  createUserWithEmailAndPassword,
  auth,
} from "../../../lib/firebaseConfig";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/shadcn/ui/button";
import { Input } from "../../components/shadcn/ui/input";
import { Label } from "../../components/shadcn/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/shadcn/ui/card";
import BackToMainLink from "../../components/common/BackToMainLink";
import { FirebaseError } from "firebase/app";

export default function Register() {
  const [formData, setFormData] = useState({
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
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      // 1. Firebase Authentication に新規登録
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
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
          municipalityCode: "01100",
          municipalityName: formData.municipalityName,
          furigana: formData.furigana,
          postalCode: formData.postalCode,
          address: formData.address,
          department: formData.department,
          contactPerson: formData.contactPersonName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          lastLogin: new Date().toISOString(), // 現在時刻
        }),
      });

      if (!res.ok) {
        throw new Error("FastAPIへの登録に失敗しました");
      }
    
      const result = await res.json();
      console.log("FastAPI 登録成功:", result);
      
      setIsSubmitted(true);

    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("登録エラー:", error.message);
        alert("登録に失敗しました: " + error.message);
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="municipalityCode">
                      地方公共団体コード <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="municipalityCode"
                      name="municipalityCode"
                      placeholder="例：131130"
                      value={formData.municipalityCode ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="municipalityName">
                      自治体名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="municipalityName"
                      name="municipalityName"
                      placeholder="例：東京都渋谷区"
                      value={formData.municipalityName ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="furigana">
                      フリガナ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="furigana"
                      name="furigana"
                      placeholder="例：トウキョウトシブヤク"
                      value={formData.furigana ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">
                      郵便番号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="例：150-8010"
                      value={formData.postalCode ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      住所 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="例：東京都渋谷区宇田川町1-1"
                      value={formData.address ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">
                      担当部署 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="例：環境政策部"
                      value={formData.department ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPersonName">
                      担当者名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactPersonName"
                      name="contactPersonName"
                      placeholder="例：山田 太郎"
                      value={formData.contactPersonName ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      電話番号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="例：03-1234-5678"
                      value={formData.phoneNumber ?? ""}
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
                      placeholder="例：yamada@city.shibuya.tokyo.jp"
                      value={formData.email ?? ""}
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
                        value={formData.password ?? ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        パスワード（確認）{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword ?? ""}
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

                <Button
                  type="submit"
                  className="w-full bg-[#78B9C6] hover:bg-[#6aaab7]"
                >
                  登録する
                </Button>
              </form>
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
