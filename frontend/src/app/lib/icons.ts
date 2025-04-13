//icon.ts
import React from 'react';
import { JSX } from "react";
// import { FaRecycle, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
// import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaFire } from "react-icons/fa6";
// import { BsTrashFill } from "react-icons/bs";
import { RiRecycleFill } from "react-icons/ri";
import { LiaWineBottleSolid } from "react-icons/lia";
import { FiPackage } from "react-icons/fi";
// import { GiSpray } from "react-icons/gi";
import { TfiSpray } from "react-icons/tfi";
import { GiTreeBranch } from "react-icons/gi";
import { IoTrashBinSharp } from "react-icons/io5";

export const getTrashIcon = (category: string | null): JSX.Element => {
  switch (category) {
    case "Combustible":
      return React.createElement(FaFire,{ style: { color: 'rgb(255,0,0)' } }); 
    case "Non-Combustible":
      return React.createElement(TfiSpray , { style: { color: 'blue' } }); 
    case "Bottles":
      return React.createElement(LiaWineBottleSolid,  { style: { color: 'rgb(255,171,0)' } }); 
    case "Plastic":
      return React.createElement(RiRecycleFill, { style: { color: 'rgb(103, 119, 139)' } }); 
      case "Paper":
        return React.createElement(FiPackage, { style: { color: 'rgba(185, 137, 32, 1)' } }); 
        case "Branches":
          return React.createElement(GiTreeBranch , { style: { color: 'rgba(199, 134, 14, 1)' } }); 
    default:
      return React.createElement(IoTrashBinSharp , { size: 24, color: "gray" });
  }
};
