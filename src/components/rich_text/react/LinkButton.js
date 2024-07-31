import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { useSlate } from "slate-react";
import { Icon } from "./Icon";
import { activeLink, insertLink, removeLink } from "../utils/inlines";

export default function LinkButton({
  isOpen,
  setIsOpen,
  inputRef,
  buttonRef,
  onLinkChange,
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

  const handleUnlink = (e) => {
    e.preventDefault();
    removeLink(editor, inputValue);

    close();
    onLinkChange();
  };

  const handleLink = (e) => {
    e.preventDefault();
    insertLink(editor, inputValue);

    close();
    onLinkChange();
  };

  return (
    <>
      <Button
        ref={buttonRef}
        reversed
        active={activeLink(editor)}
        aria-label="select link"
        onMouseDown={(event) => {
          event.preventDefault();
          toggleOpen();
        }}
      >
        <Icon>link</Icon>
      </Button>
      <div
        ref={modalRef}
        className={`hovering-link-modal ${isOpen ? "" : "os-hidden"}`}
      >
        <input
          className="hovering-link-modal-input"
          autoFocus
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <a
          className="hovering-link-modal-button"
          onClick={handleUnlink}
        >
          Unlink
        </a>
        <a
          className="hovering-link-modal-button"
          onClick={handleLink}
        >
          Link
        </a>
      </div>
    </>
  );
}
