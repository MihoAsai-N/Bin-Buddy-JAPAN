// Stripe決済処理を分離したユーティリティ
import { PaymentIntentResult, Stripe, StripeElements, StripeError } from "@stripe/stripe-js";

const usedClientSecrets = new Set<string>();

export const processPayment = async (
  stripe: Stripe,
  elements: StripeElements,
  clientSecret: string
) : Promise<PaymentIntentResult> => {
  if (usedClientSecrets.has(clientSecret)) {
    const error: StripeError = {
      type: "invalid_request_error", // Stripeの定義されている error type のひとつ
      message: "すでに処理されています",
      code: "payment_intent_duplicate",
    };
    return {
      error
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
