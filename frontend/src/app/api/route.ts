
// export async function GET(
//   request: Request) {
//   const { searchParams } = new URL(request.url);
//   const test = searchParams.get('area');
//   console.log(test) 
// }


//アクセス成功↓↓
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const area = searchParams.get('area');

//   const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql?sql=SELECT \"日付\", \"${area}\" FROM \"a261bccd-4383-487f-aa2d-3a502469e7ad\" WHERE \"日付\" >= '2025-01-01' AND \"日付\" < '2026-01-01'`;
//   const encoded = encodeURI(url);

//   try {
//     const response = await fetch(encoded, {
//       cache: "no-store",
//     });
//     console.log(response);
//     const result = await response.json();
//     console.log(result);
//     return Response.json({ result });
//   } catch (error) {
//     console.log("API fetch error:", error);
//     return Response.json({ sucess: "failed" });
//   }
// }
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const area = searchParams.get('area');

//   const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql?sql=SELECT "日付", "${area}" FROM "a261bccd-4383-487f-aa2d-3a502469e7ad" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`;
//   const encoded = encodeURI(url);

//   try {
//     const response = await fetch(encoded, {
//       cache: "no-store",
//     });
//     console.log(response);
//     const externalApiResult = await response.json();
//     console.log(externalApiResult);

//     if (externalApiResult && externalApiResult.success && externalApiResult.result && externalApiResult.result.records) {
//       const records = externalApiResult.result.records;
//       const fields = externalApiResult.result.fields;

//       // クライアントに返すデータを整形する例
//       const formattedData = records.map((record: { [x: string]: any; }) => {
//         const formattedRecord: { [key: string]: any } = {};
//         fields.forEach((field: { id: string | number; }, index: string | number) => {
//           formattedRecord[field.id] = record[index]; // 配列形式の場合
//           // または (オブジェクト形式の場合)
//           // formattedRecord[field.id] = record[field.id];
//         });
//         return formattedRecord;
//       });

//       return Response.json({ data: formattedData, success: true });
//     } else {
//       console.error("外部 API から期待するデータ構造ではありません:", externalApiResult);
//       return Response.json({ success: false, error: "データの取得に失敗しました" });
//     }

//   } catch (error) {
//     console.log("API fetch error:", error);
//     return Response.json({ success: false, error: "API エラーが発生しました" });
//   }
// }

// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//これ値でたよ
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const area = searchParams.get('area');

//   const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql`; // POST の場合はエンドポイントが変わる可能性あり

//   try {
//     const response = await fetch(url, {
//       method: 'POST', // メソッドを POST に変更
//       headers: {
//         'Content-Type': 'application/json',
//         // 必要に応じて他のヘッダーを追加
//       },
//       body: JSON.stringify({ // POST データ
//         sql: `SELECT "日付", "${area}" FROM "a261bccd-4383-487f-aa2d-3a502469e7ad" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`,
//       }),
//       cache: "no-store",
//     });
//     console.log(response);
//     const result = await response.json();
//     console.log(result);
//     return Response.json({ result });
//   } catch (error) {
//     console.log("API fetch error:", error);
//     return Response.json({ success: "failed" });
//   }
// }
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// 良い感じにデータがとれる↓↓

// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const area = searchParams.get('area');

//   const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql?sql=SELECT "日付", "${area}" FROM "a261bccd-4383-487f-aa2d-3a502469e7ad" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`;
//   const encoded = encodeURI(url);

//   try {
//     const response = await fetch(encoded, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       console.error(`外部 API エラー: ${response.status} - ${response.statusText}`);
//       return NextResponse.json({ success: false, error: `データの取得に失敗しました (${response.status})` }, { status: response.status });
//     }

//     const externalApiResult = await response.json();

//     if (externalApiResult && externalApiResult.success && externalApiResult.result && externalApiResult.result.records) {
//       return NextResponse.json({ data: externalApiResult.result.records, success: true });
//     } else {
//       console.error("外部 API から期待するデータ構造ではありません:", externalApiResult);
//       return NextResponse.json({ success: false, error: "データの取得に失敗しました" });
//     }

//   } catch (error: any) {
//     console.error("API fetch error:", error.message);
//     return NextResponse.json({ success: false, error: `API エラーが発生しました: ${error.message}` }, { status: 500 });
//   }
// }
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// key 日付：value "1"のかたちに編集済み
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');

  const url = `https://ckan.pf-sapporo.jp/api/3/action/datastore_search_sql?sql=SELECT "日付", "${area}" FROM "a261bccd-4383-487f-aa2d-3a502469e7ad" WHERE "日付" >= '2025-01-01' AND "日付" < '2026-01-01'`;
  const encoded = encodeURI(url);

  try {
    const response = await fetch(encoded, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`外部 API エラー: ${response.status} - ${response.statusText}`);
      return NextResponse.json({ success: false, error: `データの取得に失敗しました (${response.status})` }, { status: response.status });
    }

    const externalApiResult = await response.json();

    if (externalApiResult && externalApiResult.success && externalApiResult.result && externalApiResult.result.records) {
      const formattedData = externalApiResult.result.records.map((record: { [x: string]: any; }) => {
        const date = record["日付"];
        const value = record[`${area}`];
        return { [date]: value };
      });
      return NextResponse.json({ data: formattedData, success: true });
    } else {
      console.error("外部 API から期待するデータ構造ではありません:", externalApiResult);
      return NextResponse.json({ success: false, error: "データの取得に失敗しました" });
    }

  } catch (error: any) {
    console.error("API fetch error:", error.message);
    return NextResponse.json({ success: false, error: `API エラーが発生しました: ${error.message}` }, { status: 500 });
  }
}