import React from "react";

export default function Element(props) {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "link":
      return (
        <a {...attributes} target="_blank" href={element.url}>
          {children}
        </a>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "heading-1":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-2":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-3":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-4":
      return <h4 {...attributes}>{children}</h4>;
    case "paragraph":
      return <p {...attributes}>{children}</p>;
    case "rich-text-block":
      return <div {...attributes}>{children}</div>;
    case "caption":
      return <small {...attributes}>{children}</small>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}
