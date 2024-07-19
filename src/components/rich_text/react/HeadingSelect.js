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
  const menuRef = useRef();
  const buttonRef = useRef();
  const editor = useSlate();

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (buttonRef.current.contains(event.target)) {
        return;
      } else if (event.target !== menuRef.current) {
        close();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  const handleChange = (value) => {
    toggleBlock(editor, value);
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
        ref={menuRef}
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
          <div
            key={option.value}
            onMouseDown={() => {
              handleChange(option.value);
            }}
            className={cx(
              "hovering-heading-menu-item",
              css`
              width: 100%;
              padding: 8px 16px;
              font-weight: 500;
              color: #333;
              background-color: ${isBlockActive(editor, option.value) ? "#f5f5f5" : "#fff"
                };
              cursor: pointer;

              &:hover {
                background-color: #f5f5f5;
              }
            `,
            )}
          >
            {option.name}
          </div>
        ))}
      </div>
    </>
  );
}
