// @ts-types="solid-js"
import { ReactNode } from "react";
import "./index.scss";

export type ButtonStyles = "default" | "outline";

export interface ButtonProps {
  label?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  style?: ButtonStyles;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} type="button" className={`button button--${props.style || "default"}`}>
      {props.leftIcon && <i>{props.leftIcon}</i>}
      {props.label && <span>{props.label}</span>}
      {props.rightIcon && <i>{props.rightIcon}</i>}
    </button>
  );
}
