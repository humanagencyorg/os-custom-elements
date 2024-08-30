import React from "react";
import { createRoot } from "react-dom/client";
import { defaultStyles } from "./utils/styles";
import RichText from "./react/RichText";

export class OSRichText extends HTMLElement {
  static defaultStylesAdded = false;

  constructor() {
    super();
    this.emptyValue = [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];
    this.defaultStyles = defaultStyles;
  }

  connectedCallback() {
    // Add default styles if they haven't been added yet
    if (!OSRichText.defaultStylesAdded) {
      document.head.insertAdjacentHTML(
        "afterbegin",
        this.defaultStyles,
      );

      OSRichText.defaultStylesAdded = true;
    }
    const dataFieldUuid = this.getAttribute("data-os-uuid");
    const defaultValue = this.getAttribute("value");
    const placeholder = this.getAttribute("placeholder");

    const rootEl = document.createElement("div");
    rootEl.setAttribute("id", `root-${dataFieldUuid}`);
    this.appendChild(rootEl);

    const root = createRoot(rootEl);
    this.dispatchLoadingEvent(false);
    root.render(
      <RichText
        placeholder={placeholder}
        defaultValue={this.prepareDefaultValue(defaultValue)}
      />,
    );

    // Slate can't be a controlled component
    // we need to re-render root element to set default value
    this.addEventListener("initialized", (event) => {
      const root = createRoot(rootEl);
      this.dispatchLoadingEvent(false);
      root.render(
        <RichText
          defaultValue={this.prepareDefaultValue(event.detail.value)}
          placeholder={placeholder}
        />,
      );
    });
  }

  dispatchLoadingEvent(value) {
    this.dispatchEvent(
      new CustomEvent("rich-text-loading", { detail: { value } }),
    );
  }

  prepareDefaultValue(value) {
    if (!value) {
      return this.emptyValue;
    }

    try {
      const newValue = JSON.parse(value);
      return newValue || this.emptyValue;
    } catch (e) {
      if (typeof value === "string") {
        const newValue = [...this.emptyValue];
        newValue[0].children[0].text = value;
        return newValue;
      } else {
        return value;
      }
    }
  }
}

customElements.define("os-rich-text", OSRichText);
