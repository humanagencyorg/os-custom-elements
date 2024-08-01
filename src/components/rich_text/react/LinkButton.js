import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { useSlate } from "slate-react";
import { Icon } from "./Icon";
import { activeLink, insertLink, removeLink } from "../utils/inlines";

const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export default function LinkButton({
  position,
  isOpen,
  setIsOpen,
}) {
  const [inputValue, setInputValue] = useState("");
  const modalRef = useRef();
  const inputRef = useRef();
  const buttonRef = useRef();
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
        active={activeLink(editor)}
        aria-label="select link"
        onMouseDown={(event) => {
          event.preventDefault();
          toggleOpen();
        }}
      >
        <Icon>link</Icon>
      </Button>
      <Portal>
        <div
          ref={modalRef}
          className={`hovering-link-modal ${isOpen ? "" : "os-hidden"}`}
          style={position}
        >
          <input
            className="hovering-link-modal-input"
            autoFocus
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <Button onClick={handleUnlink}>
            <Icon>link_off</Icon>
          </Button>
          <Button onClick={handleLink}>
            <Icon>link</Icon>
          </Button>
        </div>
      </Portal>
    </>
  );
}
