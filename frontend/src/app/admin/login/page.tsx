"use client";

import { signInWithEmailAndPassword, auth } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";

import type { NextPage } from "next";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/admin/components/shadcn/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/admin/components/shadcn/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/app/admin/components/shadcn/ui/button";
import { Input } from "@/app/admin/components/shadcn/ui/input";
import { FirebaseError } from "firebase/app";

type LoginForm = z.infer<typeof loginSchema>

const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
})

const Page: NextPage = () => {

  const router = useRouter();

  async function onSubmit(values: LoginForm) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.username,
        values.password
      );
      console.log("ログイン成功:", userCredential.user);
      router.push("/dashboard"); // TODO: ログイン後の遷移先は決済ページ
    } catch (error) {
        if (error instanceof FirebaseError){
          alert("ログイン失敗: " + error.message);
        }else{
          alert("不明なエラーが発生しました");
        }
    }
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
    },
  })

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <CardHeader>
              <CardTitle>ログイン</CardTitle>
              <CardDescription>
                ユーザー名/パスワードによるログイン
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ユーザー名</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">ログイン</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Page;