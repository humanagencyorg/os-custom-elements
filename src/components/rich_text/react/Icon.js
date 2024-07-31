import React from "react";
import Link from "../icons/link.svg";
import Title from "../icons/title.svg";
import FormatBold from "../icons/format_bold.svg";
import FormatItalic from "../icons/format_italic.svg";
import FormatUnderlined from "../icons/format_underlined.svg";
import FormatStrikethrough from "../icons/format_strikethrough.svg";
import FormatListBulleted from "../icons/format_list_bulleted.svg";
import FormatListNumbered from "../icons/format_list_numbered.svg";
import FormatAlignLeft from "../icons/format_align_left.svg";
import FormatAlignCenter from "../icons/format_align_center.svg";
import FormatAlignRight from "../icons/format_align_right.svg";

const icons = {
  link: Link,
  title: Title,
  format_bold: FormatBold,
  format_italic: FormatItalic,
  format_underlined: FormatUnderlined,
  format_strikethrough: FormatStrikethrough,
  format_list_bulleted: FormatListBulleted,
  format_list_numbered: FormatListNumbered,
  format_align_left: FormatAlignLeft,
  format_align_center: FormatAlignCenter,
  format_align_right: FormatAlignRight,
};

export function Icon({ children }) {
  return (
    <img
      className="hovering-toolbar-icon"
      src={icons[children]}
    />
  );
}
