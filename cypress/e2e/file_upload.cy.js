context("upload field", function () {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("when upload is failed", () => {
    it("shows error message", function () {
      const firstFieldUuid = "upload_field_1_uuid";
      const fieldErrorSelector =
        `[data-os-element='field-error'][data-os-for='${firstFieldUuid}']`;

      cy.get(fieldErrorSelector).should("not.be.visible");
      cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
        "directUploadError",
      );
      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`).within(
        () => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        },
      );

      cy.wait("@directUploadError").then(() => {
        cy.get(fieldErrorSelector)
          .should("be.visible")
          .and("contain.text", "Error creating Blob");
      });
    });
  });

  describe("when the file size is exceeded", () => {
    it("shows error message", function () {
      const secondFieldUuid = "upload_field_2_uuid";
      const fieldErrorSelector =
        `[data-os-element='field-error'][data-os-for='${secondFieldUuid}']`;
      const thirtyMb = 30 * 1024 * 1024;
      const bigFile = Cypress.Buffer.alloc(thirtyMb);
      bigFile.write("X", thirtyMb);

      cy.get(fieldErrorSelector).should("not.be.visible");
      cy.get(`os-file-upload[data-os-uuid='${secondFieldUuid}']`).within(() => {
        cy.get("input[type='file']")
          .selectFile({
            contents: bigFile,
            fileName: "30mb.txt",
            mimeType: "text/plain",
          });
      });
      cy.get(fieldErrorSelector)
        .should("be.visible")
        .and(
          "contain.text",
          "File size exceeds the limit of 25MB. Please select a smaller file.",
        );
    });
  });
});
