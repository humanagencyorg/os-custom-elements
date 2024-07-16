import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RichText from "../react/RichText";
import { host, workspaceId } from "../utils/script_attributes";

export class OSRichText extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const dataFieldUuid = this.getAttribute("data-os-uuid");
    const rootEl = document.createElement("div");
    rootEl.setAttribute("id", `root-${dataFieldUuid}`);
    this.appendChild(rootEl);

    const root = createRoot(rootEl);
    root.render(
      <StrictMode>
        <RichText />
      </StrictMode>,
    );
  }
}

customElements.define("os-rich-text", OSRichText);
