import React from "react";

export const Button = React.forwardRef(
  (
    {
      active,
      reversed,
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      ref={ref}
      className={`hovering-toolbar-button${active ? " hovering-toolbar-button-active" : ""
        }`}
    />
  ),
);
