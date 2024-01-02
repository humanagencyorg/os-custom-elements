context("country field", function() {
  beforeEach(() => {
    cy.fixture("countries_response.json").as("countriesResponse");
  });

  it("passes workspace id from the script src to the request headers", function() {
    cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
      .as("countriesSuccess");
    cy.visit("/");

    cy.wait("@countriesSuccess").then(
      (interception) => {
        expect(interception.request.headers["workspace-id"]).to.equal("1");
      },
    );
  });


  describe("when element tag missing 'data-os-uuid' tag", () => {
    it("warns user in console", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.console, "warn").as("consoleWarn");
        },
      });

      // NOTE: Need to remove 'data-os-uuid' from <os-county> tag.

      cy.get("@consoleWarn").should(
        "be.calledWith",
        "data-os-uuid was not found for <os-county> element",
      );
    });

    it("does not make API request with null uuid", function() {
      cy.intercept("GET", "**/api/v1/data_fields/**/countries").as("countriesRequest");

      // NOTE: Need to remove 'data-os-uuid' from <os-county> tag.

      cy.visit("/");
      cy.wait(500);

      cy.get("@countriesRequest.all").should("have.length", 0);
    });
  })

  describe("when countries request succeeded", () => {
    it("populates select options", function() {
      cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
        .as("countriesSuccess");
      cy.visit("/");

      cy.wait("@countriesSuccess").then(() => {
        cy.get("select").find("option").should("have.length", 4);
        cy.get("select").find("option").eq(1).should("have.value", "CA");
        cy.get("select").find("option").eq(1).should("have.text", "Canada");
      });
    });

    it("sets default value from the attribute", function() {
      cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
        .as("countriesSuccess");
      cy.visit("/");

      cy.wait("@countriesSuccess").then(() => {
        cy.get("select").should("have.value", "UA");
      });
    });

    it("sets custom tag value on country select", function() {
      cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
        .as("countriesSuccess");
      cy.visit("/");

      cy.wait("@countriesSuccess").then(() => {
        cy.get("select").select("CA");

        cy.get("os-country").should("have.attr", "value", "CA");
      });
    });
  });
});
