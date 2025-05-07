-- 管理者情報: 札幌市
INSERT INTO admin_info (
  uid,
  municipality_code,
  municipality_name,
  furigana,
  postal_code,
  address,
  department,
  contact_person,
  phone_number,
  email,
  last_login,
  payment_status,
  payment_date,
  note
) VALUES (
  'hMnKdx1F6hY6bZRdqhjJW1GOmNJ2',
  '011002',
  '札幌市',
  'サッポロシ',
  '060-8611',
  '北海道札幌市中央区北1条西2丁目',
  '環境局 環境事業部',
  '水井 花子',
  '0123456789',
  'binbuddy@example.com',
  NOW(),
  'paid',
  NOW(),
  '初期登録'
);

-- 管理者情報: 東京都渋谷区
INSERT INTO admin_info (
  uid,
  municipality_code,
  municipality_name,
  furigana,
  postal_code,
  address,
  department,
  contact_person,
  phone_number,
  email,
  last_login,
  payment_status,
  payment_date,
  note
) VALUES (
  'b9ihEDGUiQN4AkB2V8P8nNXgdks2',
  '131130',
  '東京都渋谷区',
  'トウキョウトシブヤク',
  '150-8010',
  '東京都渋谷区宇田川町1-1',
  '環境政策部 清掃リサイクル課',
  '渋谷 太郎',
  '0123456789',
  'binbuddy2@example.com',
  NOW(),
  'unpaid',
  NULL,
  '初期登録（未決済）'
);
