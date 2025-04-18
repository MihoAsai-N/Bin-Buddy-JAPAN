"use client";
import React from 'react';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../../components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/shadcn/ui/card";
import { ArrowLeft, CheckCircle, CreditCard, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// Stripe の公開鍵
const stripePromise = loadStripe(
  "pk_test_51RBRhUDtvvwujPXxWGVgk0VfW3Z1wSaGr4BYnG4yAsbxaYQ7PsPqOK6Swcrxb1gAMSVWICNrZ4GLioPqN4gjH2ti00txSSUlvj"
);

// カード要素のスタイル
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#4a5568",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#e53e3e",
      iconColor: "#e53e3e",
    },
  },
  hidePostalCode: true,
};

// 決済フォームコンポーネント
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 支払い処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripeの準備ができていません");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // 支払い意図を作成
      const res = await fetch("http://localhost:8000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_uid: "admin-test-1234" }),
      });

      if (!res.ok) {
        throw new Error("サーバーとの通信に失敗しました");
      }

      const { clientSecret } = await res.json();
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("カード情報が入力されていません");
      }

      // 支払いを確定
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        throw new Error(
          result.error.message ?? "支払い処理中にエラーが発生しました"
        );
      } else if (result.paymentIntent?.status === "succeeded") {
        setIsSuccess(true);
        setMessage("支払いが完了しました！");
        console.log("✅ 支払い成功：即時/admin/dashboard に遷移します");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("予期せぬエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 料金情報 */}
      <div className="rounded-lg bg-[#dbeaee] p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[#2d3748]">
              BinBuddy 自治体プラン
            </h3>
            <p className="text-sm text-[#4a5568]">年間利用料</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#2d3748]">¥120,000</p>
            <p className="text-xs text-[#4a5568]">（税込）</p>
          </div>
        </div>
      </div>

      {/* カード情報入力 */}
      <div className="space-y-2">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-[#2d3748]"
        >
          カード情報
        </label>
        <div className="mt-1 rounded-md border border-gray-300 p-4 shadow-sm">
          <CardElement id="card-element" options={cardElementOptions} />
        </div>
        <p className="text-xs text-[#4a5568] flex items-center mt-1">
          <Lock className="h-3 w-3 mr-1" />
          お支払い情報は安全に暗号化されて送信されます
        </p>
      </div>

      {/* メッセージ表示エリア */}
      {message && (
        <div
          className={`p-3 rounded-md ${
            isSuccess ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isSuccess ? (
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {message}
            </div>
          ) : (
            message
          )}
        </div>
      )}

      {/* 支払いボタン */}
      {!isSuccess ? (
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full bg-[#78B9C6] hover:bg-[#6aaab7]"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              処理中...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CreditCard className="mr-2 h-4 w-4" />
              ¥120,000を支払う
            </div>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-[#4a5568]">
            決済が完了しました。
            <br />
            確認メールを送信しましたので、メールボックスをご確認ください。
          </p>
          <Button asChild className="w-full bg-[#78B9C6] hover:bg-[#6aaab7]">
            <Link href="/admin/dashboard">ダッシュボードに進む</Link>
          </Button>
        </div>
      )}
    </form>
  );
};

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f5f8] text-[#4a5568]">
      {/* ヘッダー */}
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードに戻る
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card className="shadow-sm bg-white">
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
                お支払い
              </CardTitle>
              <CardDescription className="text-[#4a5568]">
                BinBuddyサービスのご利用料金をお支払いください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </CardContent>
            <CardFooter className="flex flex-col text-center text-xs text-[#4a5568] border-t pt-4">
              <p>
                お支払いに関するご質問は
                <a
                  href="mailto:support@binbuddy.jp"
                  className="text-[#78B9C6] hover:underline"
                >
                  support@binbuddy.jp
                </a>
                までお問い合わせください。
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t py-4 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-[#4a5568]">
            © 2025 BinBuddy株式会社. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
