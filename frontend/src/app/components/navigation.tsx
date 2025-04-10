"use client"
import { Menu, Circle, Globe, Calendar } from "lucide-react"
import { Button } from "../components/ui/button"
import { useLanguage } from "../contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Link from "next/link";
import Image from "next/image";

export function Navigation({ title }: { title?: string }) {
  const { t, language, setLanguage } = useLanguage()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center justify-center flex-grow">
      <Link href="/calendar">
      <Image
    src="/homeicon.png"
    alt="bin"
    width={200}
    height={200}
    className="mr-2"
  />
  </Link>
      </div>
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

