describe("navigate to login page", () => {
  it("Should navigate to login page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/login");
  });
});

describe("login", () => {
  it("Should be able to login with valid credentials", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[name="email"]').type("user@nextmail.com");
    cy.get('input[name="password"]').type("123456");
    cy.get("button").click();

    // After submitting the form, we should be redirected to /dashboard
    cy.url().should("include", "/dashboard");

    // Make sure the page has h1 tag with "Dashboard" text
    cy.get("h1").contains("Dashboard");
  });
});
