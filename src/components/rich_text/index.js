import React from "react";
import { createRoot } from "react-dom/client";
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
    this.defaultStyles = `
      <style>
        .rich-text-container > * {
          box-sizing: border-box;
        }
        .hovering-toolbar {
          padding: 4px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          display: flex;
          align-items: center;
          opacity: 0;
          background-color: #fff;
          border-radius: 4px;
          transition: opacity 0.5s;
          box-shadow: 0 0 5px #ddd;
        }
        .hovering-toolbar-button {
          cursor: pointer;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          margin: 0 3px;
          border-radius: 4px;
        }
        .hovering-toolbar-button:hover {
          background-color: #f5f5f5;
        }
        .hovering-toolbar-button-active {
          background-color: #d3e3fd;
        }
        .hovering-toolbar-button-active:hover {
          background-color: #d3e3fd;
        }
        .hovering-toolbar-icon {
          width: 20px;
          height: 20px;
        }
        .hovering-heading-menu {
          display: block;
          position: absolute;
          top: 40px;
          margin: 0;
          width: 130px;
          z-index: 1;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 0 5px #ddd;
        }
        .hovering-heading-menu-item {
          padding: 8px 16px;
          font-weight: 500;
          color: #333;
          background-color: #fff;
          cursor: pointer;
        }
        .hovering-heading-menu-item-active {
          background-color: #f5f5f5;
        }
        .hovering-heading-menu-item:first-child {
          border-radius: 4px 4px 0 0;
        }
        .hovering-heading-menu-item:last-child {
          border-radius: 0 0 4px 4px;
        }
        .hovering-heading-menu-item:hover {
          background-color: #f5f5f5;
        }
        .hovering-link-modal {
          position: absolute;
          display: flex;
          align-items: center;
          z-index: 1;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 0 5px #ddd;
          color: #444;
          padding: 6px 10px;
          white-space: nowrap;
          top: 40px;
          left: 60px;
        }
        .hovering-link-modal > * {
          box-sizing: border-box;
        }
        .hovering-link-modal-input {
          border: 1px solid #ccc;
          font-size: 13px;
          height: 26px;
          margin: 0;
          padding: 3px 5px;
          width: 170px;
        }
        .hovering-link-modal-button {
          margin-left: 6px;
          line-height: 24px;
          color: #333;
          text-decoration: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .hovering-link-modal-button:hover {
          background-color: #f5f5f5;
        }
        .os-hidden {
          display: none;
        }
      </style>
    `;
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
    this.addEventListener("rich-text-render", (event) => {
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
