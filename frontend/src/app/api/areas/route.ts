import { NextResponse } from "next/server";

export async function GET() {
  const mockAreas = [
    { id: "1", districtId: "1", name: "エリア①" },
    { id: "2", districtId: "1", name: "エリア②" },
    { id: "3", districtId: "1", name: "エリア③" },
    { id: "4", districtId: "2", name: "エリア①" },
    { id: "5", districtId: "2", name: "エリア②" },
  ];
  return NextResponse.json(mockAreas);
}
