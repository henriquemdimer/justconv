// @ts-types="solid-js"
import { ReactNode } from "react";
import "./index.scss";

export interface ButtonProps {
  label?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
}

export default function Button(props: ButtonProps) {
  return (
    <button type="button" className="button">
      {props.leftIcon && <i>{props.leftIcon}</i>}
      {props.label && <span>{props.label}</span>}
      {props.rightIcon && <i>{props.rightIcon}</i>}
    </button>
  );
}
