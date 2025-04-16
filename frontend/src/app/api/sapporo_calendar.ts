import axios from 'axios';

export const fetchCalendarData = async (region: { area: string } | undefined) => {
  if (!region) {
    return null;
  }

  // region が undefined でないことを確認
  if (!region.area) {
    console.error('region.area is undefined');
    return null;
  }

  const { area } = region;

  console.log('area:', area);

  const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql?sql=SELECT "日付", "${area}" FROM "a261bccd-4383-487f-aa2d-3a502469e7ad" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`;

  try {
    const response = await axios.get(url);
    console.log('response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('APIリクエストエラー:', error);
    return null;
  }
};