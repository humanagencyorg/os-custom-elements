context("signature field", function() {
  describe("on initial load", () => {
    it("renders correct elements", () => {
      cy.visit("/");

      cy.get("os-signature").should("exist");
      cy.get("os-signature").within(() => {
        cy.get(".signature-frame").should("exist");
        cy.get("input[type=hidden]").should("exist");
        cy.get(".signature-pad").should("exist");

        cy.get(".signature-pad").within(() => {
          cy.get(".signature-pad-body").should("exist");
          cy.get(".signature-pad-body").within(() => {
            cy.get("canvas").should("exist");
          });
          cy.get(".signature-pad-footer").should("exist");
          cy.get(".signature-pad-footer").within(() => {
            cy.get("button").contains("Clear").should("exist");
            cy.get("button").contains("Save").should("exist");
          });
        });
      });
    });
  });
});
