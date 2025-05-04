import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../../app/admin/(auth)/register/page";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import * as firebase from "../../app/lib/firebaseConfig";
// import type { MockedFunction } from "vitest";

// 関数の型を取得
// type CreateUserFn = typeof import("../../app/lib/firebaseConfig").createUserWithEmailAndPassword;

// 型アノテーション付きでlet宣言
// let mockCreateUserWithEmailAndPassword: MockedFunction<CreateUserFn>;

// Firebase モジュールのモック（vi.fn()を直接使い、別の変数で取得）
vi.mock("../../app/lib/firebaseConfig.ts", () => ({
  createUserWithEmailAndPassword: vi.fn<typeof import("../../app/lib/firebaseConfig").createUserWithEmailAndPassword>(),
}));


// Next.js の useRouter モック
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // vi.restoreAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("例：131130"), {
      target: { value: "131130" },
    });
    fireEvent.change(screen.getByPlaceholderText("例：東京都渋谷区"), {
      target: { value: "東京都渋谷区" },
    });
    fireEvent.change(screen.getByPlaceholderText("例：トウキョウトシブヤク"), {
      target: { value: "トウキョウトシブヤク" },
    });
    fireEvent.change(screen.getByPlaceholderText("例：150-8010"), {
      target: { value: "150-8010" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("例：東京都渋谷区宇田川町1-1"),
      {
        target: { value: "東京都渋谷区宇田川町1-1" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("例：環境政策部"), {
      target: { value: "環境政策部" },
    });
    fireEvent.change(screen.getByPlaceholderText("例：山田 太郎"), {
      target: { value: "山田 太郎" },
    });
    fireEvent.change(screen.getByPlaceholderText("例：03-1234-5678"), {
      target: { value: "03-1234-5678" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("例：yamada@city.shibuya.tokyo.jp"),
      {
        target: { value: "test@example.com" },
      }
    );
    fireEvent.change(screen.getByLabelText("パスワード *"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("パスワード（確認） *"), {
      target: { value: "password123" },
    });
  };

  it("正常系: 入力→登録成功→完了メッセージ表示", async () => {
    const mockCreateUser = firebase.createUserWithEmailAndPassword as ReturnType<typeof vi.fn>;
    mockCreateUser.mockResolvedValueOnce({
      user: {
        uid: "test-uid",
        email: "admin@binbuddy.jp",
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "ok" }),
    });

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(screen.getByText("登録が完了しました")).toBeInTheDocument();
    });
  });

  it("異常系: Firebaseで登録済みメールでエラー", async () => {
    // vi.fn() でモックされた関数を型安全に取り出す
    const mockCreateUser = firebase.createUserWithEmailAndPassword as ReturnType<typeof vi.fn>;
  
    mockCreateUser.mockRejectedValueOnce({
      code: "auth/email-already-in-use",
      message: "このメールアドレスは既に使用されています。",
    });

  // alertのスパイ
  const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  console.log("🧪 alertSpy準備完了");

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
  
    await waitFor(() => {
      console.log("🧪 alertSpy calls:", alertSpy.mock.calls);
      expect(alertSpy).toHaveBeenCalledWith(
        "登録に失敗しました: このメールアドレスは既に使用されています。"
      );
    });
  });
  

  it("異常系: フォーム未入力でバリデーションエラーが表示される", async () => {
    render(<Register />);
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(
        screen.getAllByText(/必須項目です|入力してください/).length
      ).toBeGreaterThan(0);
    });
  });

  it("異常系: FastAPI登録失敗時にアラート表示", async () => {
    // Firebaseモック関数を型付きで取得
    const mockCreateUser = firebase.createUserWithEmailAndPassword as ReturnType<typeof vi.fn>;
  
    // Firebaseユーザー作成は成功とする
    mockCreateUser.mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });

    // fetch を型付きでモック
    const mockFetch: typeof fetch = vi.fn().mockResolvedValue(
      new Error("ネットワークエラー")
    );
    
    globalThis.fetch = mockFetch;    

  const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  
    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
  
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("予期しないエラーが発生しました");
    });
  });

  it("異常系: FastAPIへの通信が例外で失敗した場合にアラート表示", async () => {
    // Firebaseモック関数を型付きで取得
    const mockCreateUser = firebase.createUserWithEmailAndPassword as ReturnType<typeof vi.fn>;
  
    // Firebaseユーザー作成は成功とする
    mockCreateUser.mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });
  
    // fetch が reject されるようにモック
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ネットワークエラー")));

  const alertSpy = vi.spyOn(window, "alert").mockImplementation((msg) => {
    console.log("🧪 alert called with:", msg);
  });
  
    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
  
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("予期しないエラーが発生しました");
    });
  });
  
})