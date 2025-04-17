import { NextResponse } from "next/server";

export async function GET() {
  const mockSchedules = [
    {
      id: "1",
      districtId: "1",
      areaId: "1",
      day: "月曜日",
      garbageTypeId: "1",
    },
    {
      id: "2",
      districtId: "1",
      areaId: "1",
      day: "水曜日",
      garbageTypeId: "3",
    },
    {
      id: "3",
      districtId: "1",
      areaId: "1",
      day: "金曜日",
      garbageTypeId: "4",
    },
    {
      id: "4",
      districtId: "1",
      areaId: "2",
      day: "火曜日",
      garbageTypeId: "1",
    },
    {
      id: "5",
      districtId: "1",
      areaId: "2",
      day: "木曜日",
      garbageTypeId: "2",
    },
  ];
  return NextResponse.json(mockSchedules);
}
