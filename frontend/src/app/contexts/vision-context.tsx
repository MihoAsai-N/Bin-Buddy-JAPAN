// // contexts/vision-context.tsx
// "use client";

// import React from 'react';
// import { createContext, useContext, useState, ReactNode } from "react";

// interface ClassifyResponse {
//   predictions: { [key: string]: number };
//   best_match: string | null;
// }

// interface VisionContextProps {
//   visionData: ClassifyResponse | null;
//   setVisionData: (data: ClassifyResponse | null) => void;
// }

// const VisionContext = createContext<VisionContextProps | undefined>(
//   undefined
// );

// export const VisionProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [visionData, setVisionData] = useState<ClassifyResponse | null>(null);

//   return (
//     <VisionContext.Provider value={{ visionData, setVisionData }}>
//       {children}
//     </VisionContext.Provider>
//   );
// };

// export const useVision = () => {
//   const context = useContext(VisionContext);
//   if (!context) {
//     throw new Error("useVision must be used within a VisionProvider");
//   }
//   return context;
// };

// contexts/vision-context.tsx
"use client";

import React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

interface ClassifyResponse {
  predictions: { [key: string]: number };
  best_match: string | null;
  trash_category?: string | null; // 追加
}

interface VisionContextProps {
  visionData: ClassifyResponse | null;
  setVisionData: (data: ClassifyResponse | null) => void;
}

const VisionContext = createContext<VisionContextProps | undefined>(undefined);

export const VisionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visionData, setVisionData] = useState<ClassifyResponse | null>(null);

  return (
    <VisionContext.Provider value={{ visionData, setVisionData }}>
      {children}
    </VisionContext.Provider>
  );
};

export const useVision = () => {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error("useVision must be used within a VisionProvider");
  }
  return context;
};
