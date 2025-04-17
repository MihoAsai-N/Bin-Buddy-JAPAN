// components/VisionResult.tsx

// "use client";

// import React from 'react';
// import { useVision } from "../contexts/vision-context";
// import { getTrashIcon } from "../lib/icons";
// import { TrashType } from "../contexts/trash-context"

// export const VisionResult: React.FC = () => {
//   const { visionData } = useVision();

//   if (!visionData) {
//     return <div> </div>;
//   }

//   return (
//     <div>
//       <h2>Vision API 結果</h2>
//       <pre>{JSON.stringify(visionData.predictions, null, 2)}</pre>
//       <div>
//         <p>
//           ゴミの分類: {visionData.trash_category} {getTrashIcon(visionData.trash_category)}
//         </p>
//       </div>
//     </div>
//   );
// };

// components/VisionResult.tsx

// "use client";

// import React from 'react';
// import { useVision } from "../contexts/vision-context";
// import { getTrashIcon } from "../lib/icons";
// import { TrashType } from "../contexts/trash-context"

// export const VisionResult: React.FC = () => {
//   const { visionData } = useVision();

//   if (!visionData) {
//     return <div> </div>;
//   }

//   return (
//     <div>
//       <h2>Vision API 結果</h2>
//       <pre>{JSON.stringify(visionData.predictions, null, 2)}</pre>
//       <div>
//         <p>
//           ゴミの分類: {visionData.best_match} {getTrashIcon(visionData.best_match as TrashType)}
//         </p>
//       </div>
//     </div>
//   );
// }
// components/VisionResult.tsx

// "use client";

// import React from 'react';
// import { useVision } from "../contexts/vision-context";
// import { getTrashIcon } from "../lib/icons";
// import { TrashType } from "../contexts/trash-context"
// import { useLanguage } from '../contexts/language-context';

// export const VisionResult: React.FC = () => {
//   const { t } = useLanguage();
//   const { visionData } = useVision();
//   const keys = Object.keys(predictions);

//   if (!visionData) {
//     return <div> </div>;
//   }

//   return (
//     <div>
//       <h2>{t("result.title")}</h2>
//       <pre>予測: {JSON.stringify(visionData.predictions, null, 2)}</pre>
//       <div>
//         <p>
//           最も可能性の高い物体: {visionData.best_match}
//         </p>
//         <p>
//         {t("result.trash.type")} {visionData.trash_category} {getTrashIcon(visionData.trash_category as TrashType)}
//         </p>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useVision } from "../contexts/vision-context";
import { getTrashIcon } from "../lib/icons";
import { TrashType } from "../contexts/trash-context";
import { useLanguage } from "../contexts/language-context";

export const VisionResult: React.FC = () => {
  const { t } = useLanguage();
  const { visionData } = useVision();

  // visionData が存在し、predictions プロパティが存在する場合のみキーを取得
  const keys = visionData?.predictions
    ? Object.keys(visionData.predictions)
    : [];

  if (!visionData) {
    return <div> </div>;
  }

  return (
    <div className="mt-10 mb-20">
      {/* <h2>{t("result.title")}</h2> */}

      <div className="grid place-items-center">
        {" "}
        {/* grid と place-items-center を親に追加 */}
        {/* <div>最も可能性の高い物体: {visionData.best_match}</div> */}
        <div className="text-zinc-600 text-center mb-3">
          {t("result.trash.type")}
        </div>{" "}
        {/* 必要に応じて text-center を追加 */}
        <div className="text-4xl">
          {getTrashIcon(visionData.trash_category as TrashType)}
        </div>
        <div className="text-2xl mb-3 text-center">
          {visionData.trash_category}
        </div>
      </div>
      <div>
        <div className="flex justify-center mb-4">
          {keys.map((key) => (
            <div key={key} className="bg-[#f2fafc] my-1 px-3 mx-3 rounded-none">
              {key}?
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
