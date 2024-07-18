import React from "react";
import { css, cx } from "@emotion/css";
import { useSlate } from "slate-react";
import { isMarkActive, toggleMark } from "./utils";

export default function FormatButton({ format, icon }) {
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

const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    },
    ref,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed ? active ? "white" : "#aaa" : active ? "black" : "#ccc"
          };
        `,
      )}
    />
  ),
);

export const Icon = React.forwardRef(
  (
    { className, ...props },
    ref,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        "material-icons",
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `,
      )}
    />
  ),
);
