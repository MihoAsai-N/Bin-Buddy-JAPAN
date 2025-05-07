describe("支払いページのUI確認とAPIスタブ", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:8000/create-payment-intent", {
      statusCode: 200,
      body: { clientSecret: "pi_test_secret_123" },
    });

    cy.visit("http://localhost:3000/admin/checkout");
  });

  //NOTE: shouldで結果確認（アサーション）あり
  // eslint-disable-next-line vitest/expect-expect
  it("料金とカード入力欄が表示される", () => {
    cy.contains("¥120,000").should("be.visible");
    cy.get("iframe").should("exist");
  });

  //NOTE: shouldで結果確認（アサーション）あり
  // eslint-disable-next-line vitest/expect-expect
  it("決済未入力でsubmitするとエラーが表示される", () => {
    cy.get("form").submit();
    cy.contains("カード番号に不備があります。").should("exist");
  });
});
