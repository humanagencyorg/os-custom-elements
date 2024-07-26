import React from "react";
import { createRoot } from "react-dom/client";
import RichText from "./react/RichText";

export class OSRichText extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const dataFieldUuid = this.getAttribute("data-os-uuid");
    const rootEl = document.createElement("div");
    const placeholder = this.getAttribute("placeholder");
    rootEl.setAttribute("id", `root-${dataFieldUuid}`);
    this.appendChild(rootEl);

    // Slate can't be a controlled component
    // if data-os-default is present, wait for the event to set the default value before render the component
    const root = createRoot(rootEl);
    if (this.getAttribute("data-os-default") === "last") {
      this.dispatchLoadingEvent(true);
      this.addEventListener("rich-text-render", (event) => {
        this.dispatchLoadingEvent(false);
        root.render(
          <RichText
            defaultValue={event.detail.value}
            placeholder={placeholder}
          />,
        );
      });
    } else {
      root.render(<RichText placeholder={placeholder} />);
    }
  }

  dispatchLoadingEvent(value) {
    this.dispatchEvent(
      new CustomEvent("rich-text-loading", { detail: { value } }),
    );
  }
}

customElements.define("os-rich-text", OSRichText);
