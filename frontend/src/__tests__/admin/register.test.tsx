import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "@/app/admin/(auth)/register/page";
import { vi } from "vitest";
import * as firebaseModule from "@/app/lib/firebaseConfig";

// Firebase と fetch を Mock
vi.mock("@/app/lib/firebaseConfig", () => ({
  auth: {},
  createUserWithEmailAndPassword: vi.fn(),
}));

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    const mockCreateUser =
      firebaseModule.createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockResolvedValueOnce({
      user: { uid: "test-uid" },
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
    const mockCreateUser =
      firebaseModule.createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockRejectedValueOnce({
      code: "auth/email-already-in-use",
      message: "このメールアドレスは既に使用されています。",
    });

    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
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
    const mockCreateUser =
      firebaseModule.createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockResolvedValueOnce({ user: { uid: "test-uid" } });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "予期しないエラーが発生しました"
      );
    });
  });

  it("異常系: FastAPIへの通信が例外で失敗した場合にアラート表示", async () => {
    const mockCreateUser =
      firebaseModule.createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockResolvedValueOnce({ user: { uid: "test-uid" } });

    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("ネットワークエラー"));

    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "予期しないエラーが発生しました"
      );
    });
  });
});
