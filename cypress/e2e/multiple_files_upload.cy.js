context("multiple upload field", function () {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("when tag has data-os-files-limit attribute", () => {
    it("sets 'multiple' attribute to the file input", function () {
      const firstFieldUuid = "upload_field_1_uuid";
      const fieldSelector = `os-file-upload[data-os-uuid='${firstFieldUuid}']`;

      cy.get(fieldSelector).within(
        () => {
          cy.get("input[type='file']").should("have.attr", "multiple");
        },
      );
    });

    describe("when multiple files are successfully uploaded", () => {
      it("adds hidden inputs with signed_id values for each file", function () {
        const firstFieldUuid = "upload_field_1_uuid";
        const fieldSelector =
          `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
        const secondFile = Cypress.Buffer.alloc(1);
        let firstApiCall = true;

        cy.intercept("POST", "**/direct_uploads*", (req) => {
          if (firstApiCall) {
            firstApiCall = false;
            req.reply({
              body: {
                "signed_id": "signed_id_value_1",
                "direct_upload": {
                  "url": "http://localhost:3000/rails/active_storage/disk/x",
                },
              },
            });
          } else {
            req.reply({
              body: {
                "signed_id": "signed_id_value_2",
                "direct_upload": {
                  "url": "http://localhost:3000/rails/active_storage/disk/x",
                },
              },
            });
          }
        })
          .as("directUploadSuccess");
        cy.intercept(
          "**/rails/active_storage/disk/*",
          { statusCode: 200 },
        )
          .as("activeStorageSuccess");

        cy.get(fieldSelector).within(
          () => {
            cy.get("input[type='file']")
              .selectFile([
                "cypress/fixtures/upload_test.txt",
                {
                  contents: secondFile,
                  fileName: "second.txt",
                  mimeType: "text/plain",
                },
              ]);
          },
        );

        cy.get("@directUploadSuccess.all").should("have.length", 2);
        cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(() => {
          cy.get(fieldSelector).within(
            () => {
              cy.get("input[type='hidden']").eq(0).should(
                "have.value",
                "signed_id_value_1",
              );
              cy.get("input[type='hidden']").eq(1).should(
                "have.value",
                "signed_id_value_2",
              );
            },
          );
        });
      });
    });

    describe("when files limit have been exceeded", () => {
      it("dispatches an error event", function () {
        const firstFieldUuid = "upload_field_1_uuid";
        const fieldSelector =
          `os-file-upload[data-os-uuid='${firstFieldUuid}']`;
        const secondFile = Cypress.Buffer.alloc(1);
        const thirdFile = Cypress.Buffer.alloc(1);

        cy.get(fieldSelector).within(
          () => {
            cy.get("input[type='file']");
          },
        );
        cy.get(`os-file-upload[data-os-uuid='${firstFieldUuid}']`)
          .then(($field) => {
            cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
          })
          .within(() => {
            cy.get("input[type='file']")
              .selectFile([
                "cypress/fixtures/upload_test.txt",
                {
                  contents: secondFile,
                  fileName: "second.txt",
                  mimeType: "text/plain",
                },
                {
                  contents: thirdFile,
                  fileName: "third.txt",
                  mimeType: "text/plain",
                },
              ]);
          });
        cy.get("@dispatchEventSpy").should((spy) => {
          const { detail } = spy.args[1][0];

          expect(detail).to.have.property("error");
          expect(detail.error).to.equal("Limit of 2 files");
        });
      });
    });
  });
});
