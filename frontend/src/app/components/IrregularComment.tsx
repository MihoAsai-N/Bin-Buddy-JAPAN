"use client";

import React /* { useEffect, useState } */ from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useLanguage } from "../contexts/language-context";

export default function IrregularComment() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="rounded-md border boeder-[#f2fafc] pt-2 pl-2 bg-[#f2fafc] flex flex-col mx-4">
        <div className="flex flex-row items-center pb-2">
          <span className="text-amber-400 mr-1 -mt-1 ">
            <FaExclamationCircle size={20} />
          </span>
          <span className="text-sm font-medium">
            {/* 4月26日の部分を動的に表示する変数などがあれば使用 */}4/1　
          </span>
          <span className="text-sm ml-5">{t("irregular.comment1")}</span>
        </div>
        <div className="flex flex-row items-center pb-2">
          <span className="text-amber-400 mr-1 -mt-1 ">
            <FaExclamationCircle size={20} />
          </span>
          <span className="text-sm font-medium">
            {/* 4月26日の部分を動的に表示する変数などがあれば使用 */}4/29
          </span>
          <span className="text-sm ml-5">{t("irregular.comment2")}</span>
        </div>
      </div>
    </div>
  );
}
