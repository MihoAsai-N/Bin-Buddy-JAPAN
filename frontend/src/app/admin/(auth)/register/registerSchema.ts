import { z } from "zod";

export const registerSchema = z
  .object({
    municipalityCode: z.string().min(1, "地方公共団体コードは必須です"),
    municipalityName: z.string().min(1, "自治体名は必須です"),
    furigana: z.string().min(1, "フリガナは必須です"),
    postalCode: z
      .string()
      .regex(/^\d{3}-\d{4}$/, "郵便番号の形式はXXX-XXXXで入力してください"),
    address: z.string().min(1, "住所は必須です"),
    department: z.string().min(1, "部署名は必須です"),
    contactPersonName: z.string().min(1, "担当者名は必須です"),
    phoneNumber: z
      .string()
      .regex(/^\d{10,11}$/, "電話番号は10〜11桁の数字のみで入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上で入力してください"),
    confirmPassword: z
      .string()
      .min(6, "パスワード（確認）は6文字以上で入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });
