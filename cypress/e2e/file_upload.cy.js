context("upload field", function () {
  beforeEach(() => {
    cy.fixture("direct_uploads_success_response.json").as(
      "directUploadsSuccess",
    );
    cy.visit("/");
  });

  it("passes workspace-id from the script src as the Uploader headers param", function () {
    const firstFieldUuid = "upload_field_1_uuid";

    cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
      .as("directUploadSuccess");
    cy.intercept("**/rails/active_storage/disk/*", this.directUploadsSuccess)
      .as("activeStorageSuccess");

    cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`).within(
      () => {
        cy.get("input[type='file']")
          .selectFile("cypress/fixtures/upload_test.txt");
      },
    );

    cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then((intercepts) => {
      expect(intercepts[0].request.headers["workspace-id"]).to.equal("1");
    });
  });

  describe("when upload succeeded", () => {
    it("shows success message", function () {
      const firstFieldUuid = "upload_field_1_uuid";
      const successMessageSelector =
        `[data-os-element='upload-success'][data-os-for='${firstFieldUuid}']`;

      cy.get(successMessageSelector).should("not.be.visible");
      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", this.directUploadsSuccess)
        .as("activeStorageSuccess");

      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`).within(
        () => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        },
      );

      cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(() => {
        cy.get(successMessageSelector)
          .should("be.visible")
          .and("contain.text", "Upload success!");
      });
    });

    it("resets the field on button click", function () {
      const firstFieldUuid = "upload_field_1_uuid";
      const fieldSelector = `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
      const successMessageSelector =
        `[data-os-element='upload-success'][data-os-for='${firstFieldUuid}']`;
      const resetButtonSelector =
        `[data-os-element='reset'][data-os-for='${firstFieldUuid}']`;

      cy.get(resetButtonSelector).should("not.be.visible");
      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", this.directUploadsSuccess)
        .as("activeStorageSuccess");

      cy.get(fieldSelector).within(
        () => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        },
      );

      cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(() => {
        cy.get(fieldSelector).within(
          () => {
            cy.get("input[type='hidden']").should(
              "have.value",
              "signed_id_value",
            );
          },
        );
        cy.get(successMessageSelector).should("be.visible");

        cy.get(resetButtonSelector).click();

        cy.get(fieldSelector).within(
          () => {
            cy.get("input[type='hidden']").should("have.value", "");
            cy.get("input[type='file']").should("have.value", "");
          },
        );
        cy.get(successMessageSelector).should("not.be.visible");
      });
    });

    it("sets signed_id value to the hidden input", function () {
      const firstFieldUuid = "upload_field_1_uuid";
      const fieldSelector = `os-file-upload[data-os-uuid='${firstFieldUuid}']`;

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", this.directUploadsSuccess)
        .as("activeStorageSuccess");

      cy.get(fieldSelector).within(
        () => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        },
      );

      cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(() => {
        cy.get(fieldSelector).within(
          () => {
            cy.get("input[type='hidden']").should(
              "have.value",
              "signed_id_value",
            );
          },
        );
      });
    });
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
