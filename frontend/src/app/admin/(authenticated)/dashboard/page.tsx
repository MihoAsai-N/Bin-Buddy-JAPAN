// frontend/src/app/admin/dashboard/page.tsx

"use client"

import { Button } from "@/app/admin/components/shadcn/ui/button"

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard Page</h1>

      <a
        href="https://invoice.stripe.com/i/acct_1RBRhUDtvvwujPXx/test_YWNjdF8xUkJSaFVEdHZ2d3VqUFh4LF9TNWRKZ3RhbVBFcFo3eUsyVTk2aFNMYWRZT0dhNFJ3LDEzNDYyMDc5NQ020058NDrwjY?s=db"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="default">請求書を表示</Button>
      </a>
    </div>
  )
}
