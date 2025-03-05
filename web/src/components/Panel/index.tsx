import { JSX } from "solid-js/jsx-runtime";
import { FaSolidArrowRightLong } from 'solid-icons/fa'
import "./index.scss";

export interface PanelProps {
  children: JSX.Element;
}

export function Container(props: PanelProps) {
  return (
    <div class="panel">
      {props.children}
    </div>
  );
}

export function Header(props: PanelProps) {
  return (
    <div class="panel__header">
      {props.children}
    </div>
  );
}

export function Footer(props: PanelProps) {
  return (
    <div class="panel__footer">
		{props.children}
    </div>
  );
}

export function Button() {
	return (
		<button type="button" class="panel__button">
			Convert 
			<FaSolidArrowRightLong />
		</button>
	)
}
