"use client";

import React from 'react';
import Image from "next/image";
import { Button } from "@/app/admin/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/admin/components/shadcn/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

type HeaderProps = {
  contactPerson: string;
  onSettingsClick: () => void;
  onLogout: () => void;
};

export default function AdminHeader({ contactPerson, onSettingsClick, onLogout }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center md:hidden">
        <Image src="/BinBuddy_Logo.png" alt="BinBuddy Logo" width={120} height={50} className="h-8 w-auto" />
      </div>
      <h1 className="text-lg font-medium text-[#2d3748] hidden md:block">管理者ダッシュボード</h1>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#dbeaee] flex items-center justify-center">
                <User className="h-4 w-4 text-[#78B9C6]" />
              </div>
              <span className="hidden md:inline">{contactPerson}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-md rounded-md">
            <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              設定
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
