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
        'data-os-view is not set for <os-table> element',
      );
    });
  });
});
