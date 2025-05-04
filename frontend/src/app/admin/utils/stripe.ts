// Stripe決済処理を分離したユーティリティ
import { Stripe, StripeElements } from "@stripe/stripe-js";

const usedClientSecrets = new Set<string>();

export const processPayment = async (
  stripe: Stripe,
  elements: StripeElements,
  clientSecret: string
) : Promise<PaymentIntentResult> => {
  if (usedClientSecrets.has(clientSecret)) {
    return {
      error: { message: "すでに処理されています" },
    };
  }
  
  const cardElement = elements.getElement("card");
  if (!cardElement) {
    throw new Error("カード情報が入力されていません");
  }

  usedClientSecrets.add(clientSecret);

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  });

  return result;
};
