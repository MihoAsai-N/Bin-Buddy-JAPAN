// C:\Users\miffi\nire\最終PJ\section9_binbuddy\frontend\src\app\admin\(authenticated)\dashboard\page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard/schedules"); // または settings でもOK
  }, [router]);

  return <p className="p-6">ダッシュボードに移動中...</p>;
}
