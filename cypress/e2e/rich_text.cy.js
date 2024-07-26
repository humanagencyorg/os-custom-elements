context("rich text field", function() {
  describe("on initial load", () => {
    it("renders textbox with hidden inputs", () => {
      cy.visit("/");

      cy.get("os-rich-text").first().should("exist");
      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").should("exist");
        cy.get("input[type=hidden][name=title]").should("exist");
        cy.get("input[type=hidden][name=title_elements]").should("exist");
        cy.get("input[type=hidden][name=title_html]").should("exist");
      });
    });
  });

  describe("on change", () => {
    it("sets rich text values to the hidden inputs", () => {
      cy.visit("/");

      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").click();
        cy.get("div[role=textbox]").type("Hello");
        cy.get("input[name=title]").should("have.value", "Hello");
        cy.get("input[name=title_elements]").should(
          "have.value",
          '[{"type":"paragraph","children":[{"text":"Hello"}]}]',
        );
        cy.get("input[name=title_html]").should(
          "have.value",
          '<p style=""><span>Hello</span></p>',
        );
      });
    });
  });

  describe("on blur", () => {
    it("dispatches rich-text-blur event", () => {
      cy.visit("/");

      const customEventStub = cy.stub();
      cy.window().then((win) => {
        cy.stub(win, "CustomEvent").callsFake((event, params) => {
          if (event === "rich-text-blur") {
            customEventStub(event, params);
          }
          return new win.Event(event, params);
        });
      });
      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").click();
      });

      // Clicking outside the rich text field
      cy.get("os-country").click();

      cy.wrap(customEventStub).should("have.been.called");
      cy.wrap(customEventStub).should(
        "have.been.calledWithMatch",
        "rich-text-blur",
      );
    });
  });
});
