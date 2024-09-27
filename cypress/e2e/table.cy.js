context("table element", function() {
  describe("when element have data-os-element=loop", () => {
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

    describe("when initialized event has been triggered", () => {
      it("renders table with data", function() {
        const data = [
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
        ];

        cy.visit("/");
        cy.get("os-table").trigger("initialized", {
          detail: { value: data },
          force: true,
        }).then(() => {
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
    });
  });
});
