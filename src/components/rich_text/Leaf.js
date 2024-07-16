import React from 'react';

export default function Leaf({ attributes, children, leaf }) {
  if (leaf.placeholder) {
    return <span {...attributes}>{children}</span>;
  }

  const styles = {};

  if (leaf.textTransform) {
    styles.textTransform = leaf.textTransform;
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span style={styles} {...attributes} >
      {children}
    </span>
  );
}
