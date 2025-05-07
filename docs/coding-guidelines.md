# コーディング規約（Coding Guidelines）

このドキュメントは、プロジェクトにおけるコード品質を保ち、チームでの開発効率を向上させることを目的としています。
すべての開発者はこの規約に従ってコーディングを行ってください。

---

## 目次

1. 共通ルール
2. 使用言語・技術ごとのスタイル
   - JavaScript / TypeScript
   - Python
   - CSS / Tailwind CSS
3. 命名規則
4. コメントの記述ルール
5. コードフォーマッタ / Linter
6. 禁止事項
7. 参考リンク

---

## 1. 共通ルール

- 可読性の高いコードを心がける
- DRY原則（Don't Repeat Yourself）を守る
- ファイル・関数は役割ごとに分ける（単一責任原則）
- レビューしやすい粒度でコミットする（1機能1コミット）
- 日本語コメントは最低限にし、英語を基本とする

---

## 2. 使用言語・技術ごとのスタイル

### JavaScript / TypeScript

- セミコロンは省略しない
- ダブルクォートではなく、シングルクォートを使用
- `any` は極力使用しない
- 型定義は明示的に記述する（特に引数・戻り値）

```ts
// NG
function add(a, b) {
  return a + b;
}

// OK
function add(a: number, b: number): number {
  return a + b;
}
```

---

### Python

section9_binbuddy\docs\Pythonコーティング規約.md 参照

---

### CSS / Tailwind CSS

- 基本は Tailwind CSS を使用
- カスタムCSSは `components/` 以下にまとめる
- 不要なクラスは削除する

---

## 3. 命名規則

| 種類       | 命名スタイル     | 例             |
|------------|------------------|----------------|
| 変数       | `camelCase`      | `userName`     |
| 関数       | `camelCase`      | `getUserInfo`  |
| クラス名   | `PascalCase`     | `UserProfile`  |
| ファイル名 | `kebab-case`     | `user-profile.tsx` |
| Python変数 | `snake_case`     | `user_name`    |

---

## 4. コメントの記述ルール

- 処理の意図が不明な箇所にはコメントを書く
- TODO・FIXMEコメントは明示的に記述する

```ts
// TODO: バリデーションを追加する
// FIXME: APIのエラーハンドリングが未実装
```

---

## 5. コードフォーマッタ / Linter

- TypeScript: ESLint, Prettier を使用
- Python: pylint, yapf
- コミット前に自動フォーマットを実行する（husky推奨）

---

## 6. 禁止事項

- 本番コードに `console.log` / `print` を残すこと
- `any` や `as unknown` の乱用
- コピペで使い回された未検証コード
- 巨大な関数・コンポーネントの作成（分割する）

---

## 7. 参考リンク

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PEP8 Style Guide for Python Code](https://pep8.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

---

## 最終更新日: 2025-04-20
