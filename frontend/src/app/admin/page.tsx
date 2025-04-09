import Image from "next/image"
import Link from "next/link"
import { Button } from "../../app/admin/components/shadcn/ui/button"
import {
  Calendar,
  Camera,
  ChevronRight,
  Globe,
  ImageIcon,
  Languages,
  MapPin,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col text-[#4a5568]">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/BinBuddy_Logo.png"
              alt="BinBuddy Logo"
              width={120}
              height={50}
              className="h-10 w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              機能
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline">
              背景
            </Link>
            <Link href="#vision" className="text-sm font-medium hover:underline">
              ビジョン
            </Link>
            <Link href="#download" className="text-sm font-medium hover:underline">
              ダウンロード
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/register">新規登録</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/login">管理者ログイン</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">メニュー</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#dbeaee] to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-[#2d3748] sm:text-4xl md:text-5xl lg:text-6xl/none">
                    ゴミ分別をもっと<span className="text-[#78B9C6]">簡単に</span>
                  </h1>
                  <p className="max-w-[600px] text-[#4a5568] md:text-xl">
                    BinBuddyは、AIを活用して外国人居住者のゴミ分別をサポートする革新的なアプリです。
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">
                    アプリをダウンロード
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">詳細を見る</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-[300px] h-[600px] rounded-[40px] border-8 border-gray-800 overflow-hidden shadow-xl">
                  <div className="absolute top-0 w-full h-6 bg-gray-800 z-10"></div>
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    alt="BinBuddy アプリのスクリーンショット"
                    width={300}
                    height={600}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#2d3748] sm:text-4xl md:text-5xl">主な機能</h2>
                <p className="max-w-[900px] text-[#4a5568] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  BinBuddyは、ゴミ分別を簡単かつ直感的に行えるよう設計されています。
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeaee]">
                  <Camera className="h-8 w-8 text-[#78B9C6]" />
                </div>
                <h3 className="text-xl font-bold text-[#2d3748]">AI画像認識</h3>
                <p className="text-center text-[#4a5568]">
                  ゴミを撮影するだけで、AIが自動的に種類を判別し、適切な分別方法を教えてくれます。
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeaee]">
                  <Calendar className="h-8 w-8 text-[#78B9C6]" />
                </div>
                <h3 className="text-xl font-bold text-[#2d3748]">回収日カレンダー</h3>
                <p className="text-center text-[#4a5568]">
                  お住まいの地域に合わせた回収日をカレンダーに表示し、いつ捨てればよいかが一目でわかります。
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeaee]">
                  <MapPin className="h-8 w-8 text-[#78B9C6]" />
                </div>
                <h3 className="text-xl font-bold text-[#2d3748]">地域設定</h3>
                <p className="text-center text-[#4a5568]">
                  お住まいの地域を登録するだけで、その地域特有のゴミ分別ルールに合わせた情報を提供します。
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeaee]">
                  <ImageIcon className="h-8 w-8 text-[#78B9C6]" />
                </div>
                <h3 className="text-xl font-bold text-[#2d3748]">視覚的ガイド</h3>
                <p className="text-center text-[#4a5568]">
                  画像やアイコンを豊富に使用し、言語に頼らずとも直感的に理解できるデザインを採用しています。
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeaee]">
                  <Languages className="h-8 w-8 text-[#78B9C6]" />
                </div>
                <h3 className="text-xl font-bold text-[#2d3748]">多言語対応</h3>
                <p className="text-center text-[#4a5568]">
                  様々な言語に対応し、日本語がわからなくても安心して利用できます。
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeaee]">
                  <Smartphone className="h-8 w-8 text-[#78B9C6]" />
                </div>
                <h3 className="text-xl font-bold text-[#2d3748]">使いやすいUI</h3>
                <p className="text-center text-[#4a5568]">
                  シンプルで直感的なユーザーインターフェースにより、誰でも簡単に使いこなせます。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f5f8]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#2d3748] sm:text-4xl">
                    サービスをつくった背景
                  </h2>
                  <p className="max-w-[600px] text-[#4a5568] md:text-xl/relaxed">
                    日本に住む多くの外国人が、言語の壁や文化の違いから、ゴミの分別方法に困難を感じています。
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#78B9C6] text-white">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2d3748]">言語の壁</h3>
                      <p className="text-sm text-[#4a5568]">
                        従来の情報源は主に日本語で提供されており、外国人居住者にとって理解が難しい状況でした。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#78B9C6] text-white">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2d3748]">文化の違い</h3>
                      <p className="text-sm text-[#4a5568]">
                        日本特有の細かいゴミ分別ルールは、他国から来た方々にとって非常に複雑で理解しづらいものです。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#78B9C6] text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2d3748]">地域社会との調和</h3>
                      <p className="text-sm text-[#4a5568]">
                        ゴミ分別のルールを守ることは、地域社会と良好な関係を築く上で重要な要素です。
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="ゴミ分別に困る外国人居住者"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="vision"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#78B9C6] to-[#6aaab7] text-white"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">BinBuddyが目指す社会</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  在日外国人の方が地域に溶け込む際の障害がひとつでも減り、お互いが隣人としてよい関係を築ける社会を目指しています。
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-white/15 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold">言語の壁を超える</h3>
                <p className="text-center">言語に関係なく、誰もが簡単に理解できる直感的なサービスを提供します。</p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-white/15 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold">地域社会との調和</h3>
                <p className="text-center">正しいゴミ分別を通じて、地域社会との良好な関係構築をサポートします。</p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-white/15 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold">環境への貢献</h3>
                <p className="text-center">
                  適切なゴミ分別を促進することで、リサイクル率の向上と環境保護に貢献します。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="download" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#2d3748] sm:text-4xl md:text-5xl">
                  今すぐBinBuddyを始めよう
                </h2>
                <p className="max-w-[900px] text-[#4a5568] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ゴミ分別の悩みから解放され、地域社会との調和を実現しましょう。
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button className="bg-[#78B9C6] hover:bg-[#6aaab7] h-14 px-8 text-lg">App Storeからダウンロード</Button>
                <Button variant="outline" className="h-14 px-8 text-lg">
                  Google Playで手に入れる
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[#425B80]">10,000+</div>
                  <p className="text-[#4a5568]">ダウンロード数</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[#425B80]">50+</div>
                  <p className="text-[#4a5568]">対応自治体</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[#425B80]">4.8/5</div>
                  <p className="text-[#4a5568]">ユーザー評価</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f5f8]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#2d3748] sm:text-4xl">お問い合わせ</h2>
                  <p className="max-w-[600px] text-[#4a5568] md:text-xl/relaxed">
                    BinBuddyについてのご質問や、導入に関するお問い合わせはこちらからお願いします。
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">お問い合わせフォーム</Button>
                  <Button variant="outline">info@binbuddy.jp</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="BinBuddyサポートチーム"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0 bg-gray-900 text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/BinBuddy_Logo.png"
              alt="BinBuddy Logo"
              width={100}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-loose md:text-left">© 2025 BinBuddy株式会社. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline">
              プライバシーポリシー
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              利用規約
            </Link>
            <Link href="/register" className="text-sm font-medium hover:underline">
              新規登録
            </Link>
            <Link href="/login" className="text-sm font-medium hover:underline">
              管理者ログイン
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
