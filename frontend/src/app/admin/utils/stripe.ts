// Stripe決済処理を分離したユーティリティ
import { Stripe, StripeElements } from "@stripe/stripe-js";

export const processPayment = async (
  stripe: Stripe,
  elements: StripeElements,
  clientSecret: string
) => {
  const cardElement = elements.getElement("card");
  if (!cardElement) {
    throw new Error("カード情報が入力されていません");
  }

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  });

  return result;
};
