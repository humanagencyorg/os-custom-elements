import React, { useCallback, useMemo, useRef, useState } from "react";
import isHotkey from "is-hotkey";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import Element from "./Element";
import Leaf from "./Leaf";
import HoveringToolbar from "./HoveringToolbar";
import { slateToHtml, slateToText } from "../utils/convertions";
import { withInlines } from "../utils/inlines";
import { toggleMark } from "./MarkButton";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+shift+s": "strikethrough",
};

export default function RichText({ defaultValue, placeholder }) {
  const [value, setValue] = useState(defaultValue);
  const ref = useRef();
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const dispatchBlurEvent = useCallback(() => {
    const osRichTextElement = ref.current.closest("os-rich-text");
    osRichTextElement.dispatchEvent(
      new CustomEvent("rich-text-blur"),
    );
  }, []);

  const htmlValue = useMemo(() => slateToHtml(value), [
    value,
  ]);
  const textValue = useMemo(() => slateToText(value), [
    value,
  ]);
  const elementsValue = useMemo(
    () => JSON.stringify(value),
    [value],
  );

  return (
    <div
      className="rich-text-container"
      ref={ref}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={setValue}
      >
        <HoveringToolbar />
        <Editable
          className="rich-text-input"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          onBlur={dispatchBlurEvent}
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
      {textValue &&
        (
          <>
            <input
              type="hidden"
              name="title"
              value={textValue}
            />
            <input
              type="hidden"
              name="title_elements"
              value={elementsValue}
            />
            <input
              type="hidden"
              name="title_html"
              value={htmlValue}
            />
          </>
        )}
    </div>
  );
}
