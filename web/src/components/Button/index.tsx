// @ts-types="solid-js"
import { JSX } from "solid-js";
import "./index.scss";

export interface ButtonProps {
  label?: string;
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
}

export default function Button(props: ButtonProps) {
  return (
    <button type="button" class="button">
      {props.leftIcon && <i>{props.leftIcon}</i>}
      {props.label && <span>{props.label}</span>}
      {props.rightIcon && <i>{props.rightIcon}</i>}
    </button>
  );
}
