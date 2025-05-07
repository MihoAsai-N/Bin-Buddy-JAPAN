import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import vitestPlugin from "eslint-plugin-vitest";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
      vitest: vitestPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...vitestPlugin.configs.recommended.rules,
      "prettier/prettier": "warn",
    },
  },
];
