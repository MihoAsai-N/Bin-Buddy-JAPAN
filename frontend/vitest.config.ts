// frontend/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/__tests__/admin/setupVitest.ts"],
    coverage: {
      reporter: ["text", "html"],
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"], // 測定対象のファイルパス
      exclude: ["**/*.test.*", "src/tests/*"], // 除外ファイル
    },
  },
});
