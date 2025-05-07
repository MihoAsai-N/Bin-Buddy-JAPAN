"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./../contexts/language-context";
import {
  Home,
  Calendar,
  Camera,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";

export function SideNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t("common.main"), icon: <Home className="h-5 w-5" /> },
    {
      href: "/calendar",
      label: t("common.calendar"),
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      href: "/scan",
      label: t("common.scan"),
      icon: <Camera className="h-5 w-5" />,
    },
    {
      href: "/",
      label: t("nav.region.settings"),
      icon: <Settings className="h-5 w-5" />,
    },
    {
      href: "/register",
      label: t("nav.user.registration"),
      icon: <User className="h-5 w-5" />,
    },
    {
      href: "/support",
      label: t("nav.support"),
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  // PC版では非表示にするため、空のdivを返す
  return <div className="hidden"></div>;
}
