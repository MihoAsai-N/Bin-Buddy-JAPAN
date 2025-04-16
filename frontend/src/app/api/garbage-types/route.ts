import { NextResponse } from "next/server";

export async function GET() {
  const mockGarbageTypes = [
    { id: "1", name: "燃えるごみ", color: "bg-red-100 text-red-800" },
    { id: "2", name: "燃えないごみ", color: "bg-blue-100 text-blue-800" },
    { id: "3", name: "プラスチック", color: "bg-yellow-100 text-yellow-800" },
    { id: "4", name: "ビン・缶", color: "bg-green-100 text-green-800" },
    { id: "5", name: "ペットボトル", color: "bg-purple-100 text-purple-800" },
    { id: "6", name: "古紙", color: "bg-gray-100 text-gray-800" },
  ];
  return NextResponse.json(mockGarbageTypes);
}
