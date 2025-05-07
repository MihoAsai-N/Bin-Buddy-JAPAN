// frontend/src/app/__tests__/admin/login.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../app/admin/(auth)/login/page";
import * as firebaseAuth from "../../app/lib/firebaseConfig";
import { FirebaseError } from "firebase/app";
import type { User, UserCredential } from "firebase/auth";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const mockUser: Partial<User> = {
  uid: "test-user",
  email: "admin@binbuddy.jp",
  emailVerified: true,
  isAnonymous: false,
};

// Firebaseのモック
vi.mock("../../app/lib/firebaseConfig", async () => {
  return {
    auth: {},
    signInWithEmailAndPassword: vi.fn(),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: メールとパスワードを正しく入力するとログイン処理が呼ばれる", async () => {
    const mockSignIn = vi.mocked(firebaseAuth.signInWithEmailAndPassword);
    mockSignIn.mockResolvedValue({
      user: mockUser as User,
    } as UserCredential);

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("admin@binbuddy.jp"), {
      target: { value: "admin@binbuddy.jp" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "secure123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        "admin@binbuddy.jp",
        "secure123",
      );
      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("異常系: メールアドレスが無効な形式の場合、バリデーションエラーを表示", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("admin@binbuddy.jp"), {
      target: { value: "invalid-email" },
    });
    fireEvent.blur(screen.getByPlaceholderText("admin@binbuddy.jp"));

    await waitFor(() => {
      expect(
        screen.getByText("有効なメールアドレス形式で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("異常系: パスワードが6文字未満の場合、バリデーションエラーを表示", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "123" },
    });
    fireEvent.blur(screen.getByLabelText("パスワード"));

    await waitFor(() => {
      expect(
        screen.getByText("パスワードは6文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("異常系: FirebaseErrorが発生した場合、アラートを表示", async () => {
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const mockSignIn = vi.mocked(firebaseAuth.signInWithEmailAndPassword);
    mockSignIn.mockRejectedValue(
      new FirebaseError("auth/unknown", "認証エラーが発生しました"),
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("admin@binbuddy.jp"), {
      target: { value: "admin@binbuddy.jp" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "secure123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        "ログイン失敗: 認証エラーが発生しました",
      );
    });

    mockAlert.mockRestore();
  });

  it("異常系: パスワードが間違っていてログインに失敗する", async () => {
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const mockSignIn = vi.mocked(firebaseAuth.signInWithEmailAndPassword);
    mockSignIn.mockRejectedValue(
      new FirebaseError("auth/wrong-password", "パスワードが間違っています"),
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("admin@binbuddy.jp"), {
      target: { value: "admin@binbuddy.jp" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        "ログイン失敗: パスワードが間違っています",
      );
    });

    mockAlert.mockRestore();
  });
});
