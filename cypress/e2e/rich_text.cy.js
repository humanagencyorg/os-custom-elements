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

  describe("hovering toolbar", () => {
    beforeEach(() => {
      cy.visit("/");

      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").click();
        cy.get("div[role=textbox]").type("Hello");
        cy.get("div[role=textbox]").type("{selectAll}");
      });
    });

    it("applies heading tag", () => {
      cy.get("[aria-label='select heading']").click();
      cy.get(".hovering-heading-menu-item").eq(0).click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("h1").should("have.text", "Hello");
      });
    });

    it("applies bold tags", () => {
      cy.get("[aria-label='select bold']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("strong").should("have.text", "Hello");
      });
    });

    it("applies italic tag", () => {
      cy.get("[aria-label='select italic']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("em").should("have.text", "Hello");
      });
    });

    it("applies underlined tag", () => {
      cy.get("[aria-label='select underline']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("u").should("have.text", "Hello");
      });
    });

    it("applies striketrhough tag", () => {
      cy.get("[aria-label='select strikethrough']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("s").should("have.text", "Hello");
      });
    });

    it("applies numbered list tag", () => {
      cy.get("[aria-label='select numbered-list").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("ol").should("have.text", "Hello");
      });
    });

    it("applies bulleted list tag", () => {
      cy.get("[aria-label='select bulleted-list").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("ul").should("have.text", "Hello");
      });
    });

    it("applies align left styles", () => {
      cy.get("[aria-label='select left']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("p").should("have.css", "text-align", "left");
      });
    });

    it("applies align center styles", () => {
      cy.get("[aria-label='select center']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("p").should("have.css", "text-align", "center");
      });
    });

    it("applies align right styles", () => {
      cy.get("[aria-label='select right']").click();

      cy.get("div[role=textbox]").within(() => {
        cy.get("p").should("have.css", "text-align", "right");
      });
    });

    describe("when link", () => {
      it("wraps link", () => {
        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-input").type("https://www.example.com");
        cy.get(".hovering-link-modal-button").eq(1).click();

        cy.get("div[role=textbox]").within(() => {
          cy.get("a").should("exist");
          cy.get("a").should("have.attr", "href", "https://www.example.com");
        });
      });

      it("dispatches rich-text-blur event", () => {
        const customEventStub = cy.stub();
        cy.window().then((win) => {
          cy.stub(win, "CustomEvent").callsFake((event, params) => {
            if (event === "rich-text-blur") {
              customEventStub(event, params);
            }
            return new win.Event(event, params);
          });
        });

        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-button").eq(1).click();

        cy.wrap(customEventStub).should("have.been.calledTwice");
        cy.wrap(customEventStub).should(
          "have.been.calledWithMatch",
          "rich-text-blur",
        );
      });
    });

    describe("when unlink", () => {
      it("unwraps link", () => {
        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-input").type("https://www.example.com");
        cy.get(".hovering-link-modal-button").eq(1).click();

        cy.get("os-rich-text").first().within(() => {
          cy.get("div[role=textbox]").type("{selectAll}");
        });

        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-input").should(
          "have.value",
          "https://www.example.com",
        );
        cy.get(".hovering-link-modal-button").eq(0).click();

        cy.get("div[role=textbox]").within(() => {
          cy.get("a").should("not.exist");
        });
      });

      it("dispatches rich-text-blur event", () => {
        const customEventStub = cy.stub();
        cy.window().then((win) => {
          cy.stub(win, "CustomEvent").callsFake((event, params) => {
            if (event === "rich-text-blur") {
              customEventStub(event, params);
            }
            return new win.Event(event, params);
          });
        });

        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-button").eq(0).click();

        cy.wrap(customEventStub).should("have.been.calledTwice");
        cy.wrap(customEventStub).should(
          "have.been.calledWithMatch",
          "rich-text-blur",
        );
      });
    });
  });
});
