import isUrl from "is-url";
import { Editor, Element as SlateElement, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const withInlines = (editor) => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = (element) =>
    ["link", "button", "badge"].includes(element.type) || isInline(element);

  editor.isElementReadOnly = (element) =>
    element.type === "badge" || isElementReadOnly(element);

  editor.isSelectable = (element) =>
    element.type !== "badge" && isSelectable(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const removeLink = (editor) => {
  if (activeLink(editor)) {
    unwrapLink(editor);
  } else {
    ReactEditor.focus(editor);
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const activeLink = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  return link;
};

const unwrapLink = (editor) => {
  ReactEditor.focus(editor);
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  Transforms.collapse(editor, { edge: "end" });
};

const wrapLink = (editor, url) => {
  if (activeLink(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  ReactEditor.focus(editor);

  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
