import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useFocused, useSlate } from "slate-react";
import { Editor, Range } from "slate";
import { css, cx } from "@emotion/css";
import MarkButton from "./MarkButton";
import BlockButton from "./BlockButton";
import HeadingSelect from "./HeadingSelect";
import LinkButton from "./LinkButton";

const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export default function HoveringToolbar({ onLinkChange }) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const menuRef = useRef();
  const linkInputRef = useRef();
  const linkButtonRef = useRef();

  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = menuRef.current;
    const { selection } = editor;

    if (!el || linkModalOpen) {
      return;
    } else if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
    } else {
      const domSelection = window.getSelection && window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        const left = rect.left + window.scrollX - el.offsetWidth / 2 +
          rect.width / 2;
        const availableWidth = window.innerWidth - el.offsetWidth;
        el.style.opacity = "1";
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
        el.style.left = `${left < 0 ? 0 : left > availableWidth ? availableWidth : left
          }px`;
      }
    }
  }, [editor.selection, inFocus, linkModalOpen]);

  return (
    <Portal>
      <div
        ref={menuRef}
        className={cx(
          "hovering-toolbar",
          css`
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
        `,
        )}
        onMouseDown={(event) => {
          if (
            (event.target !== linkInputRef.current) ||
            !linkButtonRef.current.contains(event.target)
          ) {
            // prevent losing focus on the editor
            event.preventDefault();
          }
        }}
      >
        <HeadingSelect />
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="strikethrough" icon="format_strikethrough" />
        <LinkButton
          isOpen={linkModalOpen}
          setIsOpen={setLinkModalOpen}
          inputRef={linkInputRef}
          buttonRef={linkButtonRef}
          onLinkChange={onLinkChange}
        />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
      </div>
    </Portal>
  );
}
