import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { useSlate } from "slate-react";
import { Icon } from "./Icon";
import { insertLink, activeLink, removeLink } from "../utils/inlines";
import { css, cx } from "@emotion/css";

export default function LinkButton({ inputRef, buttonRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const modalRef = useRef();
  const editor = useSlate();

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (
        buttonRef.current.contains(event.target) ||
        modalRef.current.contains(event.target)
      ) {
        inputRef.current.focus();
        return;
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
    setInputValue('');
    setIsOpen(false);
  };

  const toggleOpen = () => {
    isOpen ? close() : open();
  };

  const handleUnlink = (e) => {
    e.preventDefault();
    removeLink(editor, inputValue);

    close();
  };

  const handleLink = (e) => {
    e.preventDefault();
    insertLink(editor, inputValue);

    close();
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
          padding: 1rem;
        `,
        )}
      >
        <input
          autoFocus
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={handleUnlink}>Unlink</button>
        <button onClick={handleLink}>Link</button>
      </div>
    </>
  );
}
