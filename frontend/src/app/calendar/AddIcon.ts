// AddIcon.ts
import React from 'react';
import { JSX } from "react";
import { FaFire } from "react-icons/fa6";
import { RiRecycleFill } from "react-icons/ri";
import { LiaWineBottleSolid } from "react-icons/lia";
import { FiPackage } from "react-icons/fi";
import { TfiSpray } from "react-icons/tfi";
import { GiTreeBranch } from "react-icons/gi";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaExclamationCircle } from "react-icons/fa";


const categoryIds: { [key: string]: string } = {
  "0": "Irregular",
  "1": "Combustible",
  "2": "Non-Combustible",
  "8": "Bottles",
  "9": "Plastic",
  "10": "Paper",
  "11": "Branches",
};

export const getTrashIcon = (category: string | null): JSX.Element => {
  if (category && categoryIds[category]) {
    const categoryName = categoryIds[category];
    switch (categoryName) {
      case "Combustible":
        return React.createElement(FaFire, { style: { color: 'rgb(255,0,0)' } });
      case "Non-Combustible":
        return React.createElement(TfiSpray, { style: { color: 'blue' } });
      case "Bottles":
        return React.createElement(LiaWineBottleSolid, { style: { color: 'rgb(255,171,0)' } });
      case "Plastic":
        return React.createElement(RiRecycleFill, { style: { color: 'rgb(9, 218, 84)' } });
      case "Paper":
        return React.createElement(FiPackage, { style: { color: 'rgba(185, 137, 32, 1)' } });
      case "Branches":
        return React.createElement(GiTreeBranch, { style: { color: 'rgba(199, 134, 14, 1)' } });
      case "Irregular":
        return React.createElement(FaExclamationCircle, { style: { color: 'rgb(255, 202, 40)' } });
      default:
        return React.createElement(IoTrashBinSharp, { size: 24, color: "gray" });
    }
  } else {
    return React.createElement(IoTrashBinSharp, { size: 24, color: "gray" });
  }
};