'use client'
import React from 'react'
import Link from "next/link"
import { Button } from "../../../components/shadcn/ui/button";
// import { Calendar } from "../../../components/shadcn/ui/calendar";
import { cn } from "../../../lib/admin/utils";


export default function Home() {
  // const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <><header className="w-full p-4 flex justify-end">
      <Button asChild>
        <Link href="/auth/login">管理者ログイン</Link>
      </Button>
    </header><main className={cn()}>
        {/* <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border bg-neutral-100" /> */}
      </main></>
  );
}