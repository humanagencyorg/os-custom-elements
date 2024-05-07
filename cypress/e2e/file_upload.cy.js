import { ALLOWED_FILE_TYPES } from "../../src/utils/constants";

context("upload field", function() {
  beforeEach(() => {
    cy.fixture("direct_uploads_response.json").as("directUploadsSuccess");
    cy.visit("/");
  });

  it("passes workspace-id from the script src to the Uploader request query", function() {
    const firstFieldUuid = "upload_field_1_uuid";

    cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
      .as("directUploadSuccess");
    cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
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
    it("dispatches the success event", function() {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
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

    it("sets signed_id value to the hidden input", function() {
      const firstFieldUuid = "upload_field_1_uuid";
      const fieldSelector = `os-file-upload[data-os-uuid='${firstFieldUuid}']`;

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
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

    it("dispatches the loading event with 'false' value", function() {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
        .as("activeStorageSuccess");

      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
        .then(($field) => {
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        });

      cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(() => {
        cy.get("@dispatchEventSpy").should((spy) => {
          const { detail } = spy.args[2][0];

          expect(detail.value).to.equal(false);
        });
      });
    });
  });

  describe("when uploading", () => {
    it("dispatches the loading event with 'true' value", function() {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
        .as("activeStorageSuccess");

      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
        .then(($field) => {
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        });

      cy.get("@dispatchEventSpy").should((spy) => {
        const { detail } = spy.args[1][0];

        expect(detail.value).to.equal(true);
      });
    });
  });

  describe("when upload is failed", () => {
    it("dispatches an error event", function() {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
        "directUploadError",
      );
      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
        .then(($field) => {
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        });

      cy.wait("@directUploadError").then(() => {
        cy.get("@dispatchEventSpy").should((spy) => {
          const { detail } = spy.args[3][0];

          expect(detail.error).to.equal('Error creating Blob for "upload_test.txt". Status: 400');
          expect(detail.notifyHoneybadger).to.equal(true);
        });
      });
    });

    it("dispatches the loading event with 'false' value", function() {
      const firstFieldUuid = "upload_field_1_uuid";

      cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
        "directUploadError",
      );

      cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
        .then(($field) => {
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile("cypress/fixtures/upload_test.txt");
        });

      cy.wait("@directUploadError").then(() => {
        cy.get("@dispatchEventSpy").should((spy) => {
          const { detail } = spy.args[2][0];

          expect(detail.value).to.equal(false);
        });
      });
    });
  });

  describe("when the file size is exceeded", () => {
    it("dispatches an error event", function() {
      const secondFieldUuid = "upload_field_2_uuid";
      const bigFile = Cypress.Buffer.alloc(26 * 1024 * 1024);

      cy.get(`os-file-upload[data-os-uuid='${secondFieldUuid}']`)
        .then(($field) => {
          cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
        })
        .within(() => {
          cy.get("input[type='file']")
            .selectFile({
              contents: bigFile,
              fileName: "bigFile.txt",
              mimeType: "text/plain",
            });
        });
      cy.get("@dispatchEventSpy").should((spy) => {
        const { detail } = spy.args[1][0];

        expect(detail).to.have.property("error");
        expect(detail.error).to.equal(
          "File size exceeds the limit of 25MB. Please select a smaller file.",
        );
      });
    });
  });

  describe("when upload-reset event received", () => {
    it("resets the inputs", function() {
      const firstFieldUuid = "upload_field_1_uuid";
      const fieldSelector = `os-file-upload[data-os-uuid='${firstFieldUuid}']`;

      cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
        .as("directUploadSuccess");
      cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
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
            cy.get("input[type='hidden']").should("not.exist");
            cy.get("input[type='file']").should("have.value", "");
          },
        );
      });
    });
  });

  describe("'accept' attribute", () => {
    describe("when present", () => {
      it("sets attribute to the file input with passed value", function() {
        const firstFieldUuid = "upload_field_1_uuid";
        const fieldSelector =
          `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
        cy.get(fieldSelector).within(() => {
          cy.get("input[type='file']").should(
            "have.attr",
            "accept",
            "image/jpeg, video/*",
          );
        });
      });
    });

    describe("when not present", () => {
      it("sets attribute to the file input with default value", function() {
        const firstFieldUuid = "upload_field_2_uuid";
        const fieldSelector =
          `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
        cy.get(fieldSelector).within(() => {
          cy.get("input[type='file']").should(
            "have.attr",
            "accept",
            ALLOWED_FILE_TYPES,
          );
        });
      });
    });
  });

  describe("'required' attribute", () => {
    describe("when present", () => {
      it("sets attribute to the file input", function() {
        const firstFieldUuid = "upload_field_1_uuid";
        const fieldSelector =
          `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
        cy.get(fieldSelector).within(() => {
          cy.get("input[type='file']").should(
            "have.attr",
            "required"
          );
        });
      });
    });

    describe("when not present", () => {
      it("does not set required attribute to the file input", function() {
        const firstFieldUuid = "upload_field_2_uuid";
        const fieldSelector =
          `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
        cy.get(fieldSelector).within(() => {
          cy.get("input[type='file']").should(
            "not.have.attr",
            "required"
          );
        });
      });
    });
  });
});
