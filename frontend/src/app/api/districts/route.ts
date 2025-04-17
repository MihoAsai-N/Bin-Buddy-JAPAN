import { NextResponse } from "next/server";

export async function GET() {
  const mockDistricts = [
    { id: "1", name: "中央区" },
    { id: "2", name: "北区" },
    { id: "3", name: "東区" },
    { id: "4", name: "白石区" },
    { id: "5", name: "豊平区" },
  ];
  return NextResponse.json(mockDistricts);
}
