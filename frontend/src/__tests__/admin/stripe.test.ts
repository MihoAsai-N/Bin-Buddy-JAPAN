// stripe.test.ts
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { processPayment } from "@/app/utils/stripe"; // 決済処理本体（ユーティリティなどに定義されている前提）
import type { StripePaymentParams } from "@/app/types/payment";

const validParams: StripePaymentParams = {
  amount: 1000,
  currency: "jpy",
  cardNumber: "4242424242424242",
  expMonth: 12,
  expYear: 34,
  cvc: "123",
};

describe("Stripe 決済処理", () => {
  let mockCreateToken: any; //FIXME:any型
  let mockCreateCharge: any; //FIXME:any型

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Stripeの依存関数をモック
    mockCreateToken = vi.fn();
    mockCreateCharge = vi.fn();

    vi.mock("stripe", () => {
      return {
        default: function StripeMock() {
          return {
            tokens: {
              create: mockCreateToken,
            },
            charges: {
              create: mockCreateCharge,
            },
          };
        },
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("✅ 正常決済が成功する（有効カード）", async () => {
    mockCreateToken.mockResolvedValue({ id: "tok_test_success" });
    mockCreateCharge.mockResolvedValue({ status: "succeeded" });

    const result = await processPayment(validParams);

    expect(result.success).toBe(true);
    expect(result.message).toBe("支払いが完了しました");
  });

  it("❌ 無効なカード番号（token生成エラー）", async () => {
    mockCreateToken.mockRejectedValue(new Error("Invalid card number"));

    const result = await processPayment({
      ...validParams,
      cardNumber: "1111111111111111",
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/カード情報が正しくありません/);
  });

  it("❌ ネットワークエラー時（通信不可）", async () => {
    mockCreateToken.mockRejectedValue(new Error("Network Error"));

    const result = await processPayment(validParams);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/通信エラー/);
  });

  it("❌ 二重決済防止（短時間に同一リクエスト）", async () => {
    mockCreateToken.mockResolvedValue({ id: "tok_duplicate" });
    mockCreateCharge.mockResolvedValue({ status: "succeeded" });

    // 一度目
    const result1 = await processPayment(validParams);
    // 二度目（意図的に同じトークンIDを使って）
    const result2 = await processPayment(validParams);

    // 二重決済をチェック（実装側でチェックされている想定）
    // ※ここは実装依存なので、フラグやキャッシュ制御が入っていればそれに応じて書き換え
    expect(result2.success).toBe(false);
    expect(result2.message).toMatch(/すでに処理されています/);
  });
});
