'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './components/shadcn/ui/button'

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">WEB版</h1>
      <Link href="/admin/login">
        <Button>管理者画面</Button>
      </Link>
    </div>
  )
}

export default Page
