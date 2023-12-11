context("upload field", function () {
  beforeEach(() => {
    cy.fixture("direct_uploads_success_response.json").as(
      "directUploadsSuccess",
    );
    cy.visit("/");
  });

  it("passes workspace-id from the script src to the Uploader request query", function () {
    const firstFieldUuid = "upload_field_1_uuid";

    cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
      .as("directUploadSuccess");
    cy.intercept("**/rails/active_storage/disk/*", this.directUploadsSuccess)
      .as("activeStorageSuccess");

    cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
      .within(() => {
        cy.get("input[type='file']")
          .selectFile("cypress/fixtures/upload_test.txt");
      });

    cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(
      (intercepts) => {
        expect(intercepts[0].request.query.workspace_id).to.equal("1");
      },
    );
  });

  describe("when upload succeeded", () => {
    it("dispatches the success event", function () {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", this.directUploadsSuccess)
        .as("activeStorageSuccess");

      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
        .then(($field) => {
          $field[0].addEventListener(
            "upload-success",
            cy.stub().as("uploadSuccessStub"),
          );
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        });

      cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(() => {
        cy.get("@dispatchEventSpy").should("have.been.called");
        cy.get("@uploadSuccessStub").should("have.been.calledOnce");
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
    it("dispatches an error event", function () {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
        "directUploadError",
      );
      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
        .then(($field) => {
          $field[0].addEventListener(
            "upload-error",
            cy.stub().as("uploadErrorStub"),
          );
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        });

      cy.wait("@directUploadError").then(() => {
        cy.get("@dispatchEventSpy").should("have.been.called");
        cy.get("@uploadErrorStub").should("have.been.calledOnce");
      });
    });
  });

  describe("when the file size is exceeded", () => {
    it("dispatches and error event", function () {
      const secondFieldUuid = "upload_field_2_uuid";
      const thirtyMb = 30 * 1024 * 1024;
      const bigFile = Cypress.Buffer.alloc(thirtyMb);
      bigFile.write("X", thirtyMb);

      cy.get(`os-file-upload[data-os-uuid='${secondFieldUuid}']`)
        .then(($field) => {
          $field[0].addEventListener(
            "upload-error",
            cy.stub().as("uploadErrorStub"),
          );
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile({
              contents: bigFile,
              fileName: "30mb.txt",
              mimeType: "text/plain",
            });
        });
      cy.get("@dispatchEventSpy").should("have.been.called");
      cy.get("@uploadErrorStub").should("have.been.calledOnce");
    });
  });

  describe("when upload-reset event received", () => {
    it("resets the inputs", function () {
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

        cy.get(fieldSelector).trigger("upload-reset").within(
          () => {
            cy.get("input[type='hidden']").should("have.value", "");
            cy.get("input[type='file']").should("have.value", "");
          },
        );
      });
    });
  });
});
