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
    describe("on save button click", () => {
      beforeEach(() => {
        cy.fixture("direct_uploads_response.json").as("directUploadsSuccess");
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

      it("closes signature pad", async () => {
        cy.get(".signature-pad").should("be.visible");
        cy.get("button").contains("Save").click();
        cy.get(".signature-pad").should("not.be.visible");
      });

      describe("when canvas is empty", () => {
        it("sets empty value to the hidden input", function() {
          cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
            .as("directUploadSuccess");
          cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
            .as("activeStorageSuccess");

          cy.get("button").contains("Save").click();
          cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(
            () => {
              cy.get("os-signature").within(
                () => {
                  cy.get("input[type='hidden']").should(
                    "have.value",
                    "signed_id_value",
                  );
                },
              );
            },
          );
          cy.get(".signature-frame").click();
          cy.get("button").contains("Clear").click();
          cy.get("button").contains("Save").click();
          cy.get("input[type=hidden]").should("not.have.value");
        });

        it("sets empty value to the frame element HTML", function() {
          cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
            .as("directUploadSuccess");
          cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
            .as("activeStorageSuccess");

          cy.get("button").contains("Save").click();
          cy.get(".signature-frame").children().should("exist");
          cy.get(".signature-frame").click();
          cy.get("button").contains("Clear").click();
          cy.get("button").contains("Save").click();
          cy.get(".signature-frame").children().should("not.exist");
        });
      });

      describe("when uploading", () => {
        it("dispatches the loading event with 'true' value", function() {
          cy.get("os-signature")
            .then(($field) => {
              cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
            });

          cy.get("button").contains("Save").click();
          cy.get("@dispatchEventSpy").should((spy) => {
            const { detail } = spy.args[0][0];

            expect(detail.value).to.equal(true);
          });
        });
      });

      describe("when upload succeded", () => {
        it("sets signed_id to the hidden input value", function() {
          cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
            .as("directUploadSuccess");
          cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
            .as("activeStorageSuccess");

          cy.get("input[type=hidden]").should("not.have.value");
          cy.get("button").contains("Save").click();

          cy.wait(["@directUploadSuccess", "@activeStorageSuccess"]).then(
            () => {
              cy.get("os-signature").within(
                () => {
                  cy.get("input[type='hidden']").should(
                    "have.value",
                    "signed_id_value",
                  );
                },
              );
            },
          );
        });

        it("sets svg image to the frame element", function() {
          cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
            .as("directUploadSuccess");
          cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
            .as("activeStorageSuccess");

          cy.get(".signature-frame").children().should("not.exist");
          cy.get("button").contains("Save").click();
          cy.get(".signature-frame").invoke("html").should("include", "<svg");
        });

        it("dispatches the loading event with 'true' value", function() {
          cy.intercept("POST", "**/direct_uploads*", this.directUploadsSuccess)
            .as("directUploadSuccess");
          cy.intercept("**/rails/active_storage/disk/*", { statusCode: 200 })
            .as("activeStorageSuccess");

          cy.get("os-signature")
            .then(($field) => {
              cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
            });

          cy.get("button").contains("Save").click();
          cy.get("@dispatchEventSpy").should((spy) => {
            const { detail } = spy.args[0][0];

            expect(detail.value).to.equal(true);
          });
        });
      });

      describe("when upload is failed", () => {
        it("dispatches an error event", function() {
          cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
            "directUploadError",
          );
          cy.get("os-signature")
            .then(($field) => {
              cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
            });

          cy.get("button").contains("Save").click();
          cy.wait("@directUploadError").then(() => {
            cy.get("@dispatchEventSpy").should((spy) => {
              const { detail, type } = spy.args[1][0];

              expect(type).to.equal("signature-error");
              expect(detail.error).to.include("Error creating Blob");
            });
          });
        });

        it("dispatches the loading event with 'false' value", function() {
          cy.intercept("POST", "**/direct_uploads*", { statusCode: 400 }).as(
            "directUploadError",
          );

          cy.get("os-signature")
            .then(($field) => {
              cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
            });

          cy.get("button").contains("Save").click();
          cy.wait("@directUploadError").then(() => {
            cy.get("@dispatchEventSpy").should((spy) => {
              const { detail, type } = spy.args[2][0];

              expect(type).to.equal("signature-loading");
              expect(detail.value).to.equal(false);
            });
          });
        });
      });
    });
  });
});
