"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Cypressでの実行時のみ、仮のユーザー情報を返す
  if (
    typeof window !== "undefined" &&
    (window as { Cypress?: unknown }).Cypress
  ) {
    return { data: { uid: "test-uid-123" } as User };
  }
  return { data: user };
}
