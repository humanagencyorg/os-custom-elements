import React from "react";

export default function Element(props) {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };

  switch (element.type) {
    case "link":
      return (
        <a style={style} {...attributes} target="_blank" href={element.url}>
          {children}
        </a>
      );
    case "bulleted-list":
      return <ul style={style} {...attributes}>{children}</ul>;
    case "list-item":
      return <li style={style} {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol style={style} {...attributes}>{children}</ol>;
    case "heading-1":
      return <h1 style={style} {...attributes}>{children}</h1>;
    case "heading-2":
      return <h2 style={style} {...attributes}>{children}</h2>;
    case "heading-3":
      return <h3 style={style} {...attributes}>{children}</h3>;
    case "heading-4":
      return <h4 style={style} {...attributes}>{children}</h4>;
    case "paragraph":
      return <p style={style} {...attributes}>{children}</p>;
    case "caption":
      return <small style={style} {...attributes}>{children}</small>;
    default:
      return <p style={style} {...attributes}>{children}</p>;
  }
}
