context("rich text field", function() {
  describe("on initial load", () => {
    beforeEach(() => {
      cy.visit("/").then(() => {
        cy.request("/").then((response) => {
          const body = `
                <body>
                  <os-rich-text placeholder="Enter some text..." data-os-element="rich-text"></os-rich-text>
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

    describe("when text value is empty", () => {
      it("renders textbox with without hidden inputs", () => {
        cy.visit("/");

        cy.get("os-rich-text").first().should("exist");
        cy.get("os-rich-text").first().within(() => {
          cy.get("div[role=textbox]").should("exist");
          cy.get("input[type=hidden][name=title]").should("not.exist");
          cy.get("input[type=hidden][name=title_elements]").should("not.exist");
          cy.get("input[type=hidden][name=title_html]").should("not.exist");
        });
      });
    });

    describe("when text value is not empty", () => {
      it("renders textbox with three hidden inputs", () => {
        cy.visit("/");

        cy.get("os-rich-text").first().should("exist");
        cy.get("div[role=textbox]").type("Hello");
        cy.get("os-rich-text").first().within(() => {
          cy.get("div[role=textbox]").should("exist");
          cy.get("input[type=hidden][name=title]").should("exist");
          cy.get("input[type=hidden][name=title_elements]").should("exist");
          cy.get("input[type=hidden][name=title_html]").should("exist");
        });
      });
    });

    it("dispatches rich-text-loading event with false value", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.spy(win.HTMLElement.prototype, "dispatchEvent").as(
            "dispatchEventSpy",
          );
        },
      });

      cy.get("@dispatchEventSpy").should((spy) => {
        const { detail, type } = spy.args[0][0];
        expect(type).to.equal("rich-text-loading");
        expect(detail.value).to.equal(false);
      });
    });

    describe("when have value attribute", () => {
      beforeEach(() => {
        cy.visit("/").then(() => {
          cy.request("/").then((response) => {
            const body = `
                <body>
                  <os-rich-text data-os-element="rich-text" value="Hello"></os-rich-text>
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

      it("renders textbox with parsed default value", () => {
        cy.visit("/");

        cy.get("os-rich-text").first().should("exist");
        cy.get("os-rich-text").first().within(() => {
          cy.get("div[role=textbox]").within(() => {
            cy.get("p").should("have.text", "Hello");
          });
        });
      });
    });
  });

  describe("when initialized event has been triggered", () => {
    beforeEach(() => {
      cy.visit("/").then(() => {
        cy.request("/").then((response) => {
          const body = `
                <body>
                  <os-rich-text placeholder="Enter some text..." data-os-element="rich-text"></os-rich-text>
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

    it("renders textbox with parsed elements value", function() {
      cy.visit("/");

      cy.get("os-rich-text").trigger("initialized", {
        force: true,
        detail: {
          value: [
            {
              type: "paragraph",
              children: [{ text: "Hello" }],
            },
          ],
        },
      });

      cy.get("os-rich-text").first().within(() => {
        cy.get("div[role=textbox]").within(() => {
          cy.get("p").should("have.text", "Hello");
        });
      });
    });

    it("dispatches rich-text-loading event with false value", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.spy(win.HTMLElement.prototype, "dispatchEvent").as(
            "dispatchEventSpy",
          );
        },
      });

      cy.get("os-rich-text").trigger("initialized", {
        force: true,
        detail: {
          value: [
            {
              type: "paragraph",
              children: [{ text: "Hello" }],
            },
          ],
        },
      });

      cy.get("@dispatchEventSpy").should((spy) => {
        const { detail, type } = spy.args[2][0];
        expect(type).to.equal("rich-text-loading");
        expect(detail.value).to.equal(false);
      });
    });
  });

  describe("on change", () => {
    it("sets rich text values to the hidden inputs", () => {
      cy.visit("/");

      cy.get("os-rich-text").first().within(() => {
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
      cy.get("os-country").eq(0).click();

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
        cy.get(".hovering-toolbar-button").eq(1).click();

        cy.get("div[role=textbox]").within(() => {
          cy.get("a").should("exist");
          cy.get("a").should("have.attr", "href", "https://www.example.com");
        });
        cy.focused().should("have.attr", "role", "textbox");
      });
    });

    describe("when unlink", () => {
      it("unwraps link", () => {
        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-input").type("https://www.example.com");
        cy.get(".hovering-toolbar-button").eq(1).click();

        cy.get("os-rich-text").first().within(() => {
          cy.get("div[role=textbox]").type("{selectAll}");
        });

        cy.get("[aria-label='select link']").click();
        cy.get(".hovering-link-modal-input").should(
          "have.value",
          "https://www.example.com",
        );
        cy.get(".hovering-toolbar-button").eq(0).click();

        cy.get("div[role=textbox]").within(() => {
          cy.get("a").should("not.exist");
        });
        cy.focused().should("have.attr", "role", "textbox");
      });
    });
  });
});
