// src/app/api/admin-info/route.ts
import { NextResponse } from "next/server";

let mockAdminInfo = {
  municipalityCode: "01100",
  municipalityName: "札幌市",
  furigana: "サッポロシ",
  postalCode: "060-8611",
  address: "北海道札幌市中央区北1条西2丁目",
  department: "環境局 環境事業部",
  contactPerson: "水井 花子",
  phoneNumber: "123-4567-89",
  email: "sapporo@binbuddy.jp",
  paymentStatus: "paid",
  lastLogin: "2023-04-10 09:30",
};

export async function GET() {
  return NextResponse.json(mockAdminInfo);
}

export async function PUT(request: Request) {
  const body = await request.json();
  mockAdminInfo = { ...mockAdminInfo, ...body };
  return NextResponse.json(mockAdminInfo);
}
