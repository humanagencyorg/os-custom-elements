import React from "react";
import { createRoot } from "react-dom/client";
import RichText from "./react/RichText";
import "material-icons/iconfont/filled.css";
import { host, workspaceId } from "../../utils/script_attributes";

export class OSRichText extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const dataFieldUuid = this.getAttribute("data-os-uuid");
    const rootEl = document.createElement("div");
    rootEl.setAttribute("id", `root-${dataFieldUuid}`);
    this.appendChild(rootEl);

    // Slate can't be a controlled component
    // if data-os-default is present, wait for the event to set the default value before render the component
    const root = createRoot(rootEl);
    if (this.hasAttribute("data-os-default")) {
      this.addEventListener("rich-text-render", (event) => {
        root.render(<RichText defaultValue={event.detail.value} />);
      });
    } else {
      root.render(<RichText />);
    }
  }
}

customElements.define("os-rich-text", OSRichText);
