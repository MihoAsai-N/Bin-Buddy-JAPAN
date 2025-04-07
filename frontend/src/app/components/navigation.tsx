"use client"
import { Menu, Circle, Globe } from "lucide-react"
import { Button } from "../components/ui/button"
import { useLanguage } from "../contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Navigation({ title }: { title?: string }) {
  const { t, language, setLanguage } = useLanguage()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <div className="flex">
          <div className="h-5 w-5 bg-yellow-400 rounded-sm"></div>
          <div className="h-5 w-5 bg-blue-500 rounded-sm"></div>
          <div className="h-5 w-5 bg-green-500 rounded-sm"></div>
        </div>
        <div className="w-5">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z"
              fill="#6B7280"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-lg font-bold">{title || t("app.title")}</h1>
      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("ja")} className={language === "ja" ? "bg-muted" : ""}>
              日本語
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="rounded-full bg-purple-600 text-white">
          <Circle className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/")}>{t("nav.region.settings")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/register")}>{t("nav.user.registration")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/support")}>{t("nav.support")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

