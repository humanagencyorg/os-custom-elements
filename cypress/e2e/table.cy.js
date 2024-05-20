context("table element", function() {
  describe("when element have data-os-element=loop and data-os-view attributes", () => {
    beforeEach(() => {
      cy.visit("/").then(() => {
        cy.request("/").then((response) => {
          const body = `
            <body>
              <os-table data-os-element="loop" data-os-view="view_uuid"></os-table>
            </body>
          `;

          const modifiedHtml = response.body.replace(
            /<body>[\s\S]*<\/body>/,
            body,
          );

          cy.intercept("/", modifiedHtml);
        });
      });
    });

    it("calls api/v1/response_views/view_uuid/items", function() {
      cy.intercept(
        "GET",
        "**/api/v1/response_views/view_uuid/items",
        {
          data: [],
        },
      ).as("responseViewsItems");

      cy.visit("/");

      cy.wait("@responseViewsItems").then((interceptor) => {
        expect(interceptor.request.headers["workspace-id"]).to.equal("1");
        expect(interceptor.request.url).to.match(
          /response_views\/view_uuid\/items/,
        );
      });
    });

    describe("when response view have items", () => {
      it("renders table with data", function() {
        cy.intercept(
          "GET",
          "**/api/v1/response_views/view_uuid/items",
          {
            data: [
              [
                {
                  "columnId": 1,
                  "uuid": "column_uuid_1_1",
                  "name": "Name",
                  "value": "Mohamed Salah",
                },
                {
                  "columnId": 2,
                  "uuid": "column_uuid_1_2",
                  "name": "City",
                  "value": "Zhytomyr",
                },
              ],
              [
                {
                  "columnId": 1,
                  "uuid": "column_uuid_1_1",
                  "name": "Name",
                  "value": "Lewis Hamilton",
                },
                {
                  "columnId": 2,
                  "uuid": "column_uuid_1_2",
                  "name": "City",
                  "value": "Brovary",
                },
              ],
            ],
          },
        ).as("responseViewsItems");

        cy.visit("/");

        cy.wait("@responseViewsItems").then(() => {
          cy.get("os-table").find("table").should("exist");
          cy.get("os-table").find("thead").should("exist");
          cy.get("os-table").find("tbody").should("exist");
          cy.get("os-table").find("th").should("have.length", 2);
          cy.get("os-table").find("td").should("have.length", 4);

          cy.get("thead").within(() => {
            cy.get("th").eq(0).should("have.text", "Name");
            cy.get("th").eq(1).should("have.text", "City");
          });

          cy.get("tbody").within(() => {
            cy.get("td").eq(0).should("have.text", "Mohamed Salah");
            cy.get("td").eq(0).should(
              "have.attr",
              "data-os-column",
              "column_uuid_1_1",
            );
            cy.get("td").eq(1).should("have.text", "Zhytomyr");
            cy.get("td").eq(1).should(
              "have.attr",
              "data-os-column",
              "column_uuid_1_2",
            );
            cy.get("td").eq(2).should("have.text", "Lewis Hamilton");
            cy.get("td").eq(2).should(
              "have.attr",
              "data-os-column",
              "column_uuid_1_1",
            );
            cy.get("td").eq(3).should("have.text", "Brovary");
            cy.get("td").eq(3).should(
              "have.attr",
              "data-os-column",
              "column_uuid_1_2",
            );
          });
        });
      });

      it("renders empty element with os-hidden class", function() {
        cy.intercept(
          "GET",
          "**/api/v1/response_views/view_uuid/items",
          {
            data: [
              [
                {
                  "columnId": 1,
                  "uuid": "column_uuid_1_1",
                  "name": "Name",
                  "value": "Mohamed Salah",
                },
              ],
            ],
          },
        ).as("responseViewsItems");

        cy.visit("/");

        cy.wait("@responseViewsItems").then(() => {
          cy.get("[data-os-element=empty]").should("have.class", "os-hidden");
          cy.get("[data-os-element=empty]").should(
            "have.attr",
            "data-os-for",
            "view_uuid",
          );
          cy.get("[data-os-element=empty]").should(
            "have.text",
            "No data found",
          );
        });
      });
    });

    describe("when response view does not have items", () => {
      it("removes os-hidden class from an empty element", function() {
        cy.intercept(
          "GET",
          "**/api/v1/response_views/view_uuid/items",
          {
            data: [],
          },
        ).as("responseViewsItems");

        cy.visit("/");

        cy.wait("@responseViewsItems").then(() => {
          cy.get("[data-os-element=empty]").should("not.have.class", "os-hidden");
          cy.get("[data-os-element=empty]").should("be.visible");
        });
      });
    });

    describe("when items request does not succeeded", () => {
      it("dispatches a table-error event", function() {
        cy.intercept(
          "GET",
          "**/api/v1/response_views/view_uuid/items",
          { forceNetworkError: true },
        ).as(
          "itemsError",
        );
        cy.visit("/");

        cy.get("os-table")
          .then(($field) => {
            cy.spy($field[0], "dispatchEvent").as("dispatchEventSpy");
          });
        cy.wait("@itemsError").then(() => {
          cy.get("@dispatchEventSpy").should((spy) => {
            const { detail, type } = spy.args[0][0];
            expect(type).to.equal("table-error");
            expect(detail.error.message).to.equal("Failed to fetch");
          });
        });
      });
    });
  });

  describe("when element does not have data-os-element=loop attribute", () => {
    beforeEach(() => {
      cy.visit("/").then(() => {
        cy.request("/").then((response) => {
          const body = `
            <body>
              <os-table data-os-view="view_uuid"></os-table>
            </body>
          `;

          const modifiedHtml = response.body.replace(
            /<body>[\s\S]*<\/body>/,
            body,
          );

          cy.intercept("/", modifiedHtml);
        });
      });
    });

    it("warns user in console", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.console, "warn").as("consoleWarn");
        },
      });

      cy.get("@consoleWarn").should(
        "be.calledWith",
        'data-os-element="loop" is not set for <os-table> element',
      );
    });
  });

  describe("when element does not have data-os-view attribute", () => {
    beforeEach(() => {
      cy.visit("/").then(() => {
        cy.request("/").then((response) => {
          const body = `
            <body>
              <os-table data-os-element="loop"></os-table>
            </body>
          `;

          const modifiedHtml = response.body.replace(
            /<body>[\s\S]*<\/body>/,
            body,
          );

          cy.intercept("/", modifiedHtml);
        });
      });
    });

    it("warns user in console", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.console, "warn").as("consoleWarn");
        },
      });

      cy.get("@consoleWarn").should(
        "be.calledWith",
        "data-os-view is not set for <os-table> element",
      );
    });
  });
});
