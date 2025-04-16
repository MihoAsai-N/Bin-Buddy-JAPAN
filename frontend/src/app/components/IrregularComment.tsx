"use client";

import React,{/* { useEffect, useState } */}from "react";
import { FaExclamationCircle } from "react-icons/fa";

export default function IrregularComment() {
  return (
    <div>
        <div className="rounded-md border boeder-[#f2fafc] p-2 bg-[#f2fafc] flex flex-col mx-4">
          <div className="flex flex-row items-center">
            <span className="text-amber-400 mr-1 -mt-1 ">
              <FaExclamationCircle size={20} />
            </span>
            <span className="text-sm font-medium">
              {/* 4月26日の部分を動的に表示する変数などがあれば使用 */}4月26日
            </span>
            <span className="text-sm ml-5">古着回収</span>
          </div>
        </div>
    </div>
  );
}
