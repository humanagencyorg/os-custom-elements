context("rich text field", function() {
  describe("on initial load", () => {
    it("renders textbox with hidden inputs", () => {
      cy.visit("/");

      cy.get("os-rich-text").first().should("exist");
      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").should("exist");
        cy.get("input[type=hidden][name=title]").should("exist");
        cy.get("input[type=hidden][name=title_elements]").should("exist");
        cy.get("input[type=hidden][name=title_html]").should("exist");
      });
    });
  });

  describe("on change", () => {
    it("sets rich text values to the hidden inputs", () => {
      cy.visit("/");

      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").click();
        cy.get("div[role=textbox]").type("Hello");
        cy.get("input[name=title]").should("have.value", "Hello");
        cy.get("input[name=title_elements]").should("have.value", '[{"type":"paragraph","children":[{"text":"Hello"}]}]');
        cy.get("input[name=title_html]").should("have.value", '<p style=""><span>Hello</span></p>');
      });
    });
  });
});
