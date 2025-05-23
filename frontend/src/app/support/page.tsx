"use client";

import React from "react";

import { Navigation } from "../components/navigation";
import { useLanguage } from "../contexts/language-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useState } from "react";
import { askSupport } from "../lib/llmapi";

export default function SupportPage() {
  const { t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // ユーザーの質問をチャット履歴に追加
    const newChatHistory: { role: "user" | "assistant"; content: string }[] = [
      ...chatHistory,
      { role: "user", content: question },
    ];

    setChatHistory(newChatHistory);
    setQuestion("");

    try {
      const answer = await askSupport(question);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 md:px-25 lg:px-60">
      <Navigation />

      <div className="flex-1 p-4">
        <Card className="w-full mb-4">
          <CardHeader>
            <CardTitle>{t("support.title")}</CardTitle>
            <CardDescription>{t("support.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatHistory.length > 0 && (
                <div className="border rounded-lg p-4 max-h-120 overflow-y-auto space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-purple-100 ml-8"
                          : "bg-gray-100 mr-8"
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSend} className="flex space-x-2">
                <Input
                  placeholder={t("support.placeholder")}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <Button
                  type="submit"
                  className="bg-[#8ebac1] hover:bg-[#789ea3]"
                >
                  {t("support.send")}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("support.faq")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>{t("support.faq.1.q")}</AccordionTrigger>
                <AccordionContent>{t("support.faq.1.a")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>{t("support.faq.2.q")}</AccordionTrigger>
                <AccordionContent>{t("support.faq.2.a")}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 text-center mt-4">
          {t("common.copyright")}
        </div>
      </div>
    </div>
  );
}
