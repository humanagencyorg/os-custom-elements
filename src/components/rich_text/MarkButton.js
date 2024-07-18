import React from "react";
import { useSlate } from "slate-react";
import { isMarkActive, toggleMark } from "./utils";
import { Icon } from "./Icon";
import { Button } from "./Button";

export default function MarkButton({ format, icon }) {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isMarkActive(editor, format)}
      onClick={() => toggleMark(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
}
