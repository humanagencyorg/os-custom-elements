context("upload field", function () {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("when upload is failed", () => {
    it("shows error message", function () {
      cy.get("[data-os-element='field-error']").should("not.be.visible");

      cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
        "directUploadError",
      );

      cy.get("os-file-upload").get("input[type='file']").selectFile(
        "cypress/fixtures/upload_test.txt",
      );

      cy.wait("@directUploadError").then(() => {
        cy.get("[data-os-element='field-error']")
          .should("be.visible")
          .and("contain.text", "Error creating Blob");
      });
    });
  });
});
