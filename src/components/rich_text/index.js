import React from "react";
import { createRoot } from "react-dom/client";
import RichText from "./react/RichText";
import 'material-icons/iconfont/filled.css';
import { host, workspaceId } from "../../utils/script_attributes";

export class OSRichText extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let defaultValue;
    const dataFieldUuid = this.getAttribute("data-os-uuid");
    const rootEl = document.createElement("div");
    rootEl.setAttribute("id", `root-${dataFieldUuid}`);
    this.appendChild(rootEl);

    this.addEventListener("rich-text-value", (event) => {
      const { value } = event.detail;
      defaultValue = value;
    });

    const root = createRoot(rootEl);
    root.render(<RichText defaultValue={defaultValue} />);
  }
}

customElements.define("os-rich-text", OSRichText);
