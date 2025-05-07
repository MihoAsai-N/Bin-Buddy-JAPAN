// Legend.tsx
import React from "react";
import { useLanguage } from "../contexts/language-context";
import { legendItems } from "../lib/legendItems";

const Legend: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="m-5 pt-2 border-t border-white bg-white">
      <div className="flex flex-col gap-3">
        {legendItems.map((item) => (
          <div className="flex items-center" key={item.category}>
            {item.icon}
            <span className="pl-4">{t(item.labelKey)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
