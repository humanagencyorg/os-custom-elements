context("country field", function () {
  beforeEach(() => {
    cy.fixture("countries_response.json").as("countriesResponse");
  });

  it("passes workspace id from the script src to the request headers", function () {
      cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
        .as("countriesSuccess");
      cy.visit("/");

    cy.wait("@countriesSuccess").then(
      (interception) => {
        console.log(interception)
        expect(interception.request.headers["workspace-id"]).to.equal("1");
      },
    );
  });

  describe("when countries request succeeded", () => {
    it("populates select options", function () {
      cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
        .as("countriesSuccess");
      cy.visit("/");

      cy.wait("@countriesSuccess").then(() => {
        cy.get("select").find("option").should("have.length", 4);
        cy.get("select").find("option").eq(1).should("have.value", "CA");
        cy.get("select").find("option").eq(1).should("have.text", "Canada");
      });
    });

    it("sets default value from the attribute", function () {
      cy.intercept("GET", "**/api/v1/data_fields/country_field_uuid/countries", this.countriesResponse)
        .as("countriesSuccess");
      cy.visit("/");

      cy.wait("@countriesSuccess").then(() => {
        cy.get("select").should("have.value", "UA");
      });
    });

    it("sets custom tag value on country select", function () {
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
