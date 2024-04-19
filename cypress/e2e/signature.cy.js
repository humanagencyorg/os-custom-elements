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

  describe("when click on frame element", () => {
    it("shows signature pad", () => {
      cy.visit("/");

      cy.get(".signature-pad").should("not.be.visible");
      cy.get(".signature-frame").click();
      cy.get(".signature-pad").should("be.visible");
    });
  });

  describe("signature pad", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".signature-frame").click();
      cy.get(".signature-pad").should("be.visible");

      cy.get("canvas").trigger("pointerdown", {
        which: 1,
        force: true,
      });
      cy.get("canvas").trigger("pointermove", {
        clientX: 100,
        clientY: 100,
        force: true,
      });
      cy.get("canvas").trigger("pointermove", {
        clientX: 200,
        clientY: 200,
        force: true,
      });
      cy.get("canvas").trigger("pointerup", { which: 1, force: true });
    });

    describe("on save button click", () => {
      it("closes signature pad", async () => {
        cy.get(".signature-pad").should("be.visible");
        cy.get("button").contains("Save").click();
        cy.get(".signature-pad").should("not.be.visible");
      });

      it("sets svg image to the hidden input value", function() {
        cy.get("input[type=hidden]").should("not.have.value");
        cy.get("button").contains("Save").click();
        cy.get("input[type=hidden]").invoke("val").should("include", "<svg");
      });

      it("sets svg image to the hidden input value", function() {
        cy.get("input[type=hidden]").should("not.have.value");
        cy.get("button").contains("Save").click();
        cy.get("input[type=hidden]").invoke("val").should("include", "<svg");
      });

      it("sets svg image to the frame element", function() {
        cy.get(".signature-frame").children().should("not.exist");
        cy.get("button").contains("Save").click();
        cy.get(".signature-frame").invoke("html").should("include", "<svg");
      });

      describe("when canvas is empty", () => {
        it("sets empty value to the hidden input", function() {
          cy.get("button").contains("Save").click();
          cy.get("input[type=hidden]").invoke("val").should("include", "<svg");
          cy.get(".signature-frame").click();
          cy.get("button").contains("Clear").click();
          cy.get("button").contains("Save").click();
          cy.get("input[type=hidden]").should("not.have.value");
        });

        it("sets empty value to the frame element HTML", function() {
          cy.get("button").contains("Save").click();
          cy.get(".signature-frame").children().should("exist");
          cy.get(".signature-frame").click();
          cy.get("button").contains("Clear").click();
          cy.get("button").contains("Save").click();
          cy.get(".signature-frame").children().should("not.exist");
        });
      });
    });
  });
});
