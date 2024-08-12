import React from "react";
import { useSlate } from "slate-react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { Editor } from "slate";

export default function MarkButton({ format, icon }) {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isMarkActive(editor, format)}
      onClick={() => toggleMark(editor, format)}
      aria-label={`select ${format}`}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
}

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
