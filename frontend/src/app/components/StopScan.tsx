"use client";

import React, { useCallback } from "react";
import { useLanguage } from "../contexts/language-context";
import { useRouter } from "next/navigation";
import { FiCameraOff } from "react-icons/fi";
import { Button } from "./ui/button";

export function StopScan() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleCancel = useCallback(() => {
    router.push("/calendar");
  }, [router]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#78B9C6] border-t flex justify-around py-2 md:hidden">
      <Button
        variant="outline"
        onClick={handleCancel}
        className="flex flex-col items-center px-4 py-2 text-black font-bold border-none"
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FiCameraOff className="h-4 w-4" />
        </div>
        {t("scan.cancel")}
      </Button>
    </div>
  );
}
