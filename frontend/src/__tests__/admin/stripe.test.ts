// stripe.test.ts
import { describe, it, vi, beforeEach, afterEach, expect, type Mock } from "vitest";
import { processPayment } from "../../app/admin/utils/stripe";
import { Stripe, StripeElements } from "@stripe/stripe-js";

describe("Stripe 決済処理", () => {
  let mockCreateToken: Mock;
  let mockCreateCharge: Mock;

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

    const mockStripe = {
      confirmCardPayment: vi.fn().mockResolvedValue({
        paymentIntent: { status: "succeeded" },
      }),
    } as unknown as Stripe;
    
    const mockElements = {
      getElement: vi.fn().mockReturnValue({}), // dummy card element
    } as unknown as StripeElements;
    
    const mockClientSecret = "test_client_secret";

    const result = await processPayment(mockStripe, mockElements, mockClientSecret);

    expect(result.paymentIntent?.status).toBe("succeeded");
    expect(result.error).toBeUndefined();
  });

  it("❌ 無効なカード番号（token生成エラー）", async () => {
    const mockStripe = {
      confirmCardPayment: vi.fn().mockResolvedValue({
        error: {
          message: "カード情報が正しくありません",
        },
      }),
    } as unknown as Stripe;
  
    const mockElements = {
      getElement: vi.fn().mockReturnValue({}), // ダミーのカード要素
    } as unknown as StripeElements;
  
    const mockClientSecret = "test_client_secret";
  
    const result = await processPayment(mockStripe, mockElements, mockClientSecret);
  
    expect(result.paymentIntent).toBeUndefined();
    expect(result.error?.message).toMatch(/カード情報が正しくありません/);
  });
  

  it("❌ ネットワークエラー時（通信不可）", async () => {
    const mockStripe = {
      confirmCardPayment: vi.fn().mockRejectedValue(new Error("通信エラー")),
    } as unknown as Stripe;
  
    const mockElements = {
      getElement: vi.fn().mockReturnValue({}), // ダミーのカード要素
    } as unknown as StripeElements;
  
    const mockClientSecret = "test_client_secret";
  
    try {
      await processPayment(mockStripe, mockElements, mockClientSecret);
      // エラーが出ないのは失敗
      throw new Error("エラーが発生すべきでしたが、発生しませんでした");
    } catch (error) {
      expect((error as Error).message).toBe("通信エラー");
    }

  });
  

  it("❌ 二重決済防止（短時間に同一リクエスト）", async () => {
    const calledTokens = new Set<string>();

const mockStripe = {
  confirmCardPayment: vi.fn((clientSecret: string) => {
    if (calledTokens.has(clientSecret)) {
      return Promise.reject(new Error("すでに処理されています"));
    }
    calledTokens.add(clientSecret);
    return Promise.resolve({ paymentIntent: { status: "succeeded" } });
  }),
} as unknown as Stripe;

  
    const mockElements = {
      getElement: vi.fn().mockReturnValue({}), // ダミーのカード要素
    } as unknown as StripeElements;
  
    const mockClientSecret = "test_client_secret";
  
    // 一度目：成功
    const result1 = await processPayment(mockStripe, mockElements, mockClientSecret);
    expect(result1.paymentIntent?.status).toBe("succeeded");
    expect(result1.error).toBeUndefined();
  
    // 二度目：同じclientSecretと要素を使って二重決済（想定）
    let result2;
    try {
      result2 = await processPayment(mockStripe, mockElements, mockClientSecret);
    } catch (error) {
      result2 = { error };
    }

    // 二重決済エラーを検出するためには、processPayment 内部で何らかの制御が必要です
    // 以下のような戻り値が返ることを想定しています
    expect(result2.paymentIntent).toBeUndefined();
    expect((result2.error as Error).message).toMatch(/すでに処理されています/);
  });
  
});
