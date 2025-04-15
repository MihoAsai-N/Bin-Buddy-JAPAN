// sapporo_calendar.ts

import axios from 'axios';
import { useTrash } from '../contexts/trash-context'; // trash-context.tsx から useTrash をインポート
import React from 'react';

const Calendar: React.FC = () => {
  const { region } = useTrash(); // useTrash フックを使用して region を取得
  const area = region?.area; // region から area を取得

  // area が存在する場合のみ API リクエストを送信
  if (area) {
    const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql?sql=SELECT "日付", "${area}" FROM "a261bccd-4383-487f-aa2d-3a502469e7ad" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`;

    axios.get(url)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        throw new Error(error.message);
      });
  }

  return (
    <div>
      カレンダー
    </div>
  );
};

export default Calendar;