vi.mock("../../app/lib/firebaseConfig", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  auth: {},
}));

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

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FirebaseError } from "firebase/app";

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("alert", vi.fn());
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
      target: { value: "0312345678" },
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
    const Register = (await import("../../app/admin/(auth)/register/page"))
      .default;
    // createUserWithEmailAndPassword をモックから取得
    const { createUserWithEmailAndPassword } = await import(
      "../../app/lib/firebaseConfig"
    );

    // モック関数として動作させる
    (
      createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
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
    const Register = (await import("../../app/admin/(auth)/register/page"))
      .default;
    const { createUserWithEmailAndPassword } = await import(
      "../../app/lib/firebaseConfig"
    );

    // FirebaseError のインスタンスを作成
    const firebaseError = new FirebaseError(
      "auth/email-already-in-use",
      "このメールアドレスは既に使用されています。"
    );

    // モック関数にエラーを返すよう設定
    (
      createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(firebaseError);

    // alert のモック
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
    const Register = (await import("../../app/admin/(auth)/register/page"))
      .default;

    render(<Register />);
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(
        screen.getAllByText(/必須項目です|入力してください/).length
      ).toBeGreaterThan(0);
    });
  });

  it("異常系: FastAPI登録失敗時にアラート表示", async () => {
    // Register と firebaseConfig を遅延インポート
    const Register = (await import("../../app/admin/(auth)/register/page"))
      .default;
    const { createUserWithEmailAndPassword } = await import(
      "../../app/lib/firebaseConfig"
    );

    // Firebaseユーザー作成は成功とする
    (
      createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });

    // fetch を mock（成功だが返却値がエラー）
    global.fetch = vi.fn().mockResolvedValue(new Error("ネットワークエラー"));

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("予期しないエラーが発生しました");
    });
  });

  it("異常系: FastAPIへの通信が例外で失敗した場合にアラート表示", async () => {
    // Register コンポーネントを遅延インポート
    const Register = (await import("../../app/admin/(auth)/register/page"))
      .default;
    const { createUserWithEmailAndPassword } = await import(
      "../../app/lib/firebaseConfig"
    );

    // Firebaseユーザー作成は成功とする
    (
      createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });

    // fetch が reject されるようにモック
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ネットワークエラー"))
    );

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("予期しないエラーが発生しました");
    });
  });
});
