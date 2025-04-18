import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// garbageDayUtils.ts

export const getGarbageDay = (date: Date, records: { [key: string]: string | null }[]) => {
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00`;
  for (const record of records) {
    if (record.hasOwnProperty(dateString)) {
      return record[dateString];
    }
  }
  return null; // データが見つからない場合
};