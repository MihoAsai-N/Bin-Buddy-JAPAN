import { Button } from "../../../components/shadcn/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/shadcn/ui/card";
import { Input } from "../../../components/shadcn/ui/input";
import { Checkbox } from "../../../components/shadcn/ui/checkbox";
import { Label } from "../../../components/shadcn/ui/label";

// 管理者情報のサンプルデータを更新
const ADMIN_INFO = {
  municipalityCode: "01100",
  municipalityName: "札幌市",
  furigana: "サッポロシ",
  postalCode: "060-8611",
  address: "北海道札幌市中央区北1条西2丁目",
  department: "環境局 環境事業部",
  contactPerson: "水井 花子",
  phoneNumber: "123-4567-89",
  email: "admin@binbuddy.jp",
  lastLogin: "2023-04-10 09:30",
}

export default function SettingsPage() {
    return(
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2d3748]">管理者設定</h2>

      <Card>
        <CardHeader>
          <CardTitle>自治体情報</CardTitle>
          <CardDescription>自治体の基本情報を確認・編集できます。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="municipalityCode">地方公共団体コード</Label>
              <Input id="municipalityCode" defaultValue={ADMIN_INFO.municipalityCode} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipalityName">自治体名</Label>
              <Input id="municipalityName" defaultValue={ADMIN_INFO.municipalityName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="furigana">フリガナ</Label>
              <Input id="furigana" defaultValue={ADMIN_INFO.furigana} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input id="postalCode" defaultValue={ADMIN_INFO.postalCode} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">住所</Label>
              <Input id="address" defaultValue={ADMIN_INFO.address} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">担当部署</Label>
              <Input id="department" defaultValue={ADMIN_INFO.department} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">担当者名</Label>
              <Input id="contactPerson" defaultValue={ADMIN_INFO.contactPerson} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号</Label>
              <Input id="phoneNumber" defaultValue={ADMIN_INFO.phoneNumber} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" defaultValue={ADMIN_INFO.email} />
            </div>
            <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">変更を保存</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
          <CardDescription>アカウントのパスワードを変更します。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">現在のパスワード</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">新しいパスワード</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button className="bg-[#78B9C6] hover:bg-[#6aaab7]">パスワードを変更</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
          <CardDescription>システムからの通知設定を管理します。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">メール通知を受け取る</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="schedule-updates" defaultChecked />
              <Label htmlFor="schedule-updates">スケジュール更新の通知</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="system-updates" defaultChecked />
              <Label htmlFor="system-updates">システム更新の通知</Label>
            </div>
            <Button className="mt-4 bg-[#78B9C6] hover:bg-[#6aaab7]">設定を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
    )
} 