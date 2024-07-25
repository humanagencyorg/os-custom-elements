function serializeLeafToHtml(node) {
  let children = node.text;
  let openTag = "<span>";
  const styles = [];
  const classes = [];
  const attrs = [];

  if (classes.length > 0) {
    attrs.push(`class="${classes.join(" ")}"`);
  }

  if (styles.length > 0) {
    attrs.push(`style="${styles.join(" ")}"`);
  }

  if (attrs.length > 0) {
    openTag = `<span ${attrs.join(" ")}>`;
  }

  if (node.bold) {
    children = `<strong>${children}</strong>`;
  }

  if (node.italic) {
    children = `<em>${children}</em>`;
  }

  if (node.strikethrough) {
    children = `<s>${children}</s>`;
  }

  if (node.underline) {
    children = `<u>${children}</u>`;
  }

  return [openTag, children, "</span>"].join("");
}

function serializeNodeToHtml(node) {
  if (!node.type) {
    return serializeLeafToHtml(node);
  }

  const childrens = node.children.map(serializeNodeToHtml).join("");
  const nodeAlignStyle = node.align ? `text-align: ${node.align};` : "";

  switch (node.type) {
    case "link":
      return `<a href="${node.url}" target="_blank">${childrens}</a>`;
    case "bulleted-list":
      return `<ul>${childrens}</ul>`;
    case "list-item":
      return `<li>${childrens}</li>`;
    case "numbered-list":
      return `<ol>${childrens}</ol>`;
    case "heading-1":
      return `<h1 style="${nodeAlignStyle}">${childrens}</h1>`;
    case "heading-2":
      return `<h2 style="${nodeAlignStyle}">${childrens}</h2>`;
    case "heading-3":
      return `<h3 style="${nodeAlignStyle}">${childrens}</h3>`;
    case "heading-4":
      return `<h4 style="${nodeAlignStyle}">${childrens}</h4>`;
    case "paragraph":
      return `<p style="${nodeAlignStyle}">${childrens}</p>`;
    case "caption":
      return `<small style="${nodeAlignStyle}">${childrens}</small>`;
    default:
      return `<p style="${nodeAlignStyle}">${childrens}</p>`;
  }
}

export function slateToHtml(nodes) {
  return nodes.map(serializeNodeToHtml).join("");
}

function serializeNodeToText(node) {
  if (!node.type) {
    return node.text;
  }

  return slateToText(node.children);
}

export function slateToText(nodes) {
  return nodes.map(serializeNodeToText).join("");
}

function serializeNodeToElement(node) {
  if (!node.type) {
    return node;
  }

  const children = node.children.map(serializeNodeToElement);

  return { ...node, children };
}

export function slateToElements(nodes) {
  return nodes.map(serializeNodeToElement);
}
