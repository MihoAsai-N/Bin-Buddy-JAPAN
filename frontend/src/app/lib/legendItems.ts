// legendItems.ts
import { ReactNode } from 'react';
import { getTrashIcon } from './icons'; // icons.ts のパスを適切に修正してください

export interface LegendItem {
  category: string;
  labelKey: string;
  icon: React.JSX.Element; // icon を追加
}

export const legendItems: LegendItem[] = [
  { category: "Combustible", labelKey: "result.Combustible", icon: getTrashIcon("Combustible") },
  { category: "Non-Combustible", labelKey: "result.non.Combustible", icon: getTrashIcon("Non-Combustible") },
  { category: "Plastic", labelKey: "result.Plastic", icon: getTrashIcon("Plastic") },
  { category: "Bottles", labelKey: "result.Bottles", icon: getTrashIcon("Bottles") },
  { category: "Paper", labelKey: "result.Paper", icon: getTrashIcon("Paper") },
  { category: "Branches", labelKey: "result.Branches", icon: getTrashIcon("Branches") },
  { category: "Irregular", labelKey: "result.Irregular", icon: getTrashIcon("Irregular") },
  { category: "Not Collected", labelKey: "result.Not", icon: getTrashIcon("Not Collected") },
];