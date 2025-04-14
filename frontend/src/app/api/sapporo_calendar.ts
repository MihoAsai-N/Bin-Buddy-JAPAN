// sapporo_calendar.ts

import axios from 'axios';
import * as Papa from 'papaparse';

const apiUrl = 'https://ckan.pf-sapporo.jp/dataset/281fc9c2-7ca5-4aed-a728-0b588e509686/resource/a261bccd-4383-487f-aa2d-3a502469e7ad/download/garvagecollectioncalendar202410.csv';

async function fetchCsvData(): Promise<string> {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('CSVデータの取得に失敗しました:', error);
    throw error; // エラーを再スローして呼び出し元に伝える
  }
}

async function csvToJson(csvData: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvData, {
      header: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

export async function convertCsvToJson(): Promise<any[]> {
  try {
    const csvData = await fetchCsvData();
    return await csvToJson(csvData);
  } catch (error) {
    console.error('CSVからJSONへの変換に失敗しました:', error);
    throw error;
  }
}