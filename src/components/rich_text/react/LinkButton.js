import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { useSlate } from "slate-react";
import { Icon } from "./Icon";
import { activeLink, insertLink, removeLink } from "../utils/inlines";
import { css, cx } from "@emotion/css";

export default function LinkButton({
  isOpen,
  setIsOpen,
  inputRef,
  buttonRef,
}) {
  const [inputValue, setInputValue] = useState("");
  const modalRef = useRef();
  const editor = useSlate();

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (
        buttonRef.current.contains(event.target) ||
        modalRef.current.contains(event.target)
      ) {
        inputRef.current.focus();
      } else if (event.target !== modalRef.current) {
        close();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  const open = () => {
    const link = activeLink(editor);

    if (link) {
      setInputValue(link[0].url);
    }
    setIsOpen(true);
  };

  const close = () => {
    setInputValue("");
    setIsOpen(false);
  };

  const toggleOpen = () => {
    isOpen ? close() : open();
  };

  const dispatchBlurEvent = () => {
    setTimeout(() => {
      const osRichTextElement = modalRef.current.closest("os-rich-text");
      osRichTextElement.dispatchEvent(
        new CustomEvent("rich-text-blur"),
      );
    }, 500);
  };

  const handleUnlink = (e) => {
    e.preventDefault();
    removeLink(editor, inputValue);

    close();
    dispatchBlurEvent();
  };

  const handleLink = (e) => {
    e.preventDefault();
    insertLink(editor, inputValue);

    close();
    dispatchBlurEvent();
  };

  return (
    <>
      <Button
        ref={buttonRef}
        reversed
        active={activeLink(editor)}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleOpen();
        }}
      >
        <Icon>link</Icon>
      </Button>
      <div
        ref={modalRef}
        className={cx(
          "hovering-link-modal",
          css`
          display: ${isOpen ? "block" : "none"};
          position: absolute;
          z-index: 1;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 0 5px #ddd;
          color: #444;
          padding: 12px 16px;
          white-space: nowrap;
          top: 40px;
          left: 60px;
          & > * {
            box-sizing: border-box;
          }
        `,
        )}
      >
        <input
          className={cx(
            "hovering-link-modal-input",
            css`
            border: 1px solid #ccc;
            font-size: 13px;
            height: 26px;
            margin: 0;
            padding: 3px 5px;
            width: 170px;
          `,
          )}
          autoFocus
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <a
          className={cx(
            "hovering-link-modal-button",
            css`
            margin-left: 10px;
            line-height: 24px;
            color: #06c;
            text-decoration: none;
            cursor: pointer;
            `,
          )}
          onClick={handleUnlink}
        >
          Unlink
        </a>
        <a
          className={cx(
            "hovering-link-modal-button",
            css`
            margin-left: 10px;
            line-height: 24px;
            color: #06c;
            text-decoration: none;
            cursor: pointer;
            `,
          )}
          onClick={handleLink}
        >
          Link
        </a>
      </div>
    </>
  );
}
