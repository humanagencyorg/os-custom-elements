import React from "react";
import { css, cx } from "@emotion/css";

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          margin: 0 3px;
          border-radius: 4px;
          background-color: ${active ? "#d3e3fd" : "#fff"};
          &:hover {
            background-color: ${active ? "#d3e3fd" : "#f5f5f5"};
          }
        `,
      )}
    />
  ),
);
