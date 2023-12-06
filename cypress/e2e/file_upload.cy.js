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

  describe("when the file size is exceeded", () => {
    it("shows error message", function () {
      const thirtyMb = 30 * 1024 * 1024;
      const bigFile = Cypress.Buffer.alloc(thirtyMb);
      bigFile.write("X", thirtyMb);
      cy.get("[data-os-element='field-error']").should("not.be.visible");

      cy.get("os-file-upload").get("input[type='file']").selectFile(
        {
          contents: bigFile,
          fileName: "30mb.txt",
          mimeType: "text/plain",
        },
      );

      cy.get("[data-os-element='field-error']")
        .should("be.visible")
        .and("contain.text", "File size exceeds the limit of 25MB. Please select a smaller file.");
    });
  });
});
