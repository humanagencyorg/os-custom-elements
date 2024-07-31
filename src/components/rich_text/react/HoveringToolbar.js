import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useFocused, useSlate } from "slate-react";
import { Editor, Range } from "slate";
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
  const [linkModalPosition, setLinkModalPosition] = useState();
  const menuRef = useRef();

  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = menuRef.current;
    const { selection } = editor;

    if (!el) {
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
        const preLeft = rect.left + window.scrollX - el.offsetWidth / 2 +
          rect.width / 2;
        const availableWidth = window.innerWidth - el.offsetWidth;
        const top = rect.top + window.scrollY - el.offsetHeight;
        const left = preLeft < 0
          ? 0
          : preLeft > availableWidth
            ? availableWidth
            : preLeft;
        if (!linkModalOpen) {
          setLinkModalPosition({
            top: `${top}px`,
            left: `${left + 100}px`,
          });
        }
        el.style.opacity = "1";
        el.style.top = `${top}px`;
        el.style.left = `${left}px`;
      }
    }
  }, [editor.selection, inFocus, linkModalOpen]);

  return (
    <Portal>
      <div
        ref={menuRef}
        className="hovering-toolbar"
        onMouseDown={(event) => {
          // prevent losing focus on the editor
          event.preventDefault();
        }}
      >
        <HeadingSelect />
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="strikethrough" icon="format_strikethrough" />
        <LinkButton
          position={linkModalPosition}
          isOpen={linkModalOpen}
          setIsOpen={setLinkModalOpen}
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
