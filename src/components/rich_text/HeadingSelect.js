import React  from "react";
import { useSlate } from "slate-react";
import { isBlockActive, toggleBlock } from "./BlockButton";

const options = [
  { value: "heading-1", name: "Heading 1" },
  { value: "heading-2", name: "Heading 2" },
  { value: "heading-3", name: "Heading 3" },
  { value: "heading-4", name: "Heading 4" },
  { value: "paragraph", name: "Paragraph" },
  { value: "caption", name: "Caption" },
];

export default function HeadingSelect() {
  const editor = useSlate();
  const handleChange = (event) => {
    toggleBlock(editor, event.target.value);
  };

  return (
    <select onChange={handleChange}>
      {options.map(({ value, name }) => (
        <option key={value} selected={isBlockActive(editor, value)} value={value}>
          {name}
        </option>
      ))}
    </select>
  );
}
