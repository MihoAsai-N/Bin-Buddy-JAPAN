// components/VisionResult.tsx

"use client";

import React from 'react';
import { useVision } from "../contexts/vision-context";
import { getTrashIcon } from "../lib/icons";

export const VisionResult: React.FC = () => {
  const { visionData } = useVision();

  if (!visionData) {
    return <div> </div>;
  }

  return (
    <div>
      <h2>Vision API 結果</h2>
      <pre>{JSON.stringify(visionData.predictions, null, 2)}</pre>
      <div>
        <p>
          ゴミの分類: {visionData.trash_category} {getTrashIcon(visionData.trash_category)}
        </p>
      </div>
    </div>
  );
};