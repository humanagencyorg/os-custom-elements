import React, { useEffect, useRef, useState } from "react";
import { useSlate } from "slate-react";
import { isBlockActive, toggleBlock } from "./BlockButton";
import { css, cx } from "@emotion/css";
import { Button } from "./Button";
import { Icon } from "./Icon";

const options = [
  { value: "heading-1", name: "Heading 1" },
  { value: "heading-2", name: "Heading 2" },
  { value: "heading-3", name: "Heading 3" },
  { value: "heading-4", name: "Heading 4" },
  { value: "paragraph", name: "Paragraph" },
  { value: "caption", name: "Caption" },
];

export default function HeadingSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const buttonRef = useRef();
  const editor = useSlate();

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (buttonRef.current.contains(event.target)) {
        return;
      } else if (event.target !== ref.current) {
        close();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  const handleChange = (event) => {
    toggleBlock(editor, event.target.value);
    close();
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggleOpen = () => {
    isOpen ? close() : open();
  };

  return (
    <>
      <Button
        ref={buttonRef}
        reversed
        onMouseDown={(event) => {
          event.preventDefault();
          toggleOpen();
        }}
      >
        <Icon>title</Icon>
      </Button>
      <div
        ref={ref}
        className={cx(
          "hovering-heading-menu",
          css`
          display: ${isOpen ? "block" : "none"};
          position: absolute;
          z-index: 1;
          background-color: #fff;
        `,
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onMouseDown={(event) => {
              event.preventDefault();
              handleChange(event);
            }}
            value={option.value}
            className={cx(
              "hovering-heading-menu-item",
              css`
              display: block;
              width: 100%;
              padding: 8px 16px;
              text-align: left;
              font-size: 14px;
              font-weight: 500;
              color: #333;
              background-color: ${isBlockActive(editor, option.value) ? "#f5f5f5" : "transparent"
                };
              border: none;
              cursor: pointer;

              &:hover {
                background-color: #f5f5f5;
              }
            `,
            )}
          >
            {option.name}
          </button>
        ))}
      </div>
    </>
  );
}
