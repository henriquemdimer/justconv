import { JSX } from "solid-js";
import "./index.scss";

export interface PanelProps {
  children?: JSX.Element;
  small?: boolean;
  dynamic?: boolean;
}

export function Panel(props: PanelProps) {
  return (
    <div
      class={`panel ${props.small ? "panel--small" : ""} ${
        props.dynamic ? "panel--dynamic" : ""
      }`}
    >
      {props.children}
    </div>
  );
}
