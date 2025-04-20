// frontend/src/__tests__/admin/login.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/admin/(auth)/login/page";
import { vi } from "vitest";
import { useRouter } from "next/navigation";
import * as firebaseAuth from "../../../lib/firebaseConfig";

// Routerのモック
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Firebaseのモック
vi.mock("../../../lib/firebaseConfig", async () => {
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
    const mockPush = vi.fn();
    const mockSignIn = vi.mocked(firebaseAuth.signInWithEmailAndPassword);
    mockSignIn.mockResolvedValue({ user: { uid: "test-user" } });

    vi.mocked(useRouter).mockReturnValue({ push: mockPush });

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
        "secure123"
      );
      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("異常系: メールアドレスが無効な形式ならバリデーションエラーを表示", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("admin@binbuddy.jp"), {
      target: { value: "invalid-email" },
    });
    fireEvent.blur(screen.getByPlaceholderText("admin@binbuddy.jp"));

    await waitFor(() => {
      expect(
        screen.getByText("有効なメールアドレス形式で入力してください")
      ).toBeInTheDocument();
    });
  });

  it("異常系: パスワードが6文字未満ならバリデーションエラーを表示", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "123" },
    });
    fireEvent.blur(screen.getByLabelText("パスワード"));

    await waitFor(() => {
      expect(
        screen.getByText("パスワードは6文字以上で入力してください")
      ).toBeInTheDocument();
    });
  });

  it("異常系: Firebaseエラーが発生した場合はalertが表示される", async () => {
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const mockSignIn = vi.mocked(firebaseAuth.signInWithEmailAndPassword);
    mockSignIn.mockRejectedValue({ message: "ログイン失敗エラー" });

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
        "ログイン失敗: ログイン失敗エラー"
      );
    });

    mockAlert.mockRestore();
  });
});
