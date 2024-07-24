import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import Element from "./Element";
import Leaf from "./Leaf";
import HoveringToolbar from "./HoveringToolbar";
import {
  slateToElements,
  slateToHtml,
  slateToText,
} from "../utils/convertions";
import { withInlines } from "../utils/inlines";
import { toggleMark } from "./MarkButton";
import { css, cx } from "@emotion/css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value],
  );

  return debouncedValue;
};

const INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const prepareInitValue = (defaultValue) =>
  (defaultValue && JSON.parse(defaultValue)) || INITIAL_VALUE;

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+shift+s": "strikethrough",
};

export default function RichText({ defaultValue }) {
  console.log(defaultValue)
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );
  const [value, setValue] = useState(prepareInitValue());
  const debouncedValue = useDebounce(value, 500);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const htmlValue = useMemo(() => slateToHtml(debouncedValue), [
    debouncedValue,
  ]);
  const textValue = useMemo(() => slateToText(debouncedValue), [
    debouncedValue,
  ]);
  const elementsValue = useMemo(
    () => JSON.stringify(slateToElements(debouncedValue)),
    [debouncedValue],
  );

  return (
    <div
      className={cx(
        "rich-text-container",
        css`
        & > * {
         box-sizing: border-box; 
        }
      `,
      )}
    >
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(value) => setValue(value)}
      >
        <HoveringToolbar />
        <Editable
          style={{ outline: "none" }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text…"
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
      <input
        type="hidden"
        name="elements_value"
        value={elementsValue}
      />
      <input
        type="hidden"
        name="html_value"
        value={htmlValue}
      />
      <input
        type="hidden"
        name="text_value"
        value={textValue}
      />
    </div>
  );
}
