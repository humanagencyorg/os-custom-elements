import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useFocused, useSlate } from "slate-react";
import { Editor, Range } from "slate";
import { css, cx } from "@emotion/css";
import MarkButton from "./MarkButton";
import BlockButton from "./BlockButton";
import HeadingSelect from "./HeadingSelect";

const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

const Menu = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          & > * + * {
            margin-left: 15px;
          }
        `,
      )}
    />
  ),
);

export default function HoveringToolbar() {
  const menuRef = useRef(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = menuRef.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
      }px`;
  }, [editor.selection, inFocus]);

  return (
    <Portal>
      <Menu
        ref={menuRef}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={(event) => event.preventDefault()}
      >
        <HeadingSelect />
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="strikethrough" icon="format_strikethrough" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
      </Menu>
    </Portal>
  );
}
