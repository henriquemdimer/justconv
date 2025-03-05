import { JSX } from "solid-js/jsx-runtime";
import "./index.scss"

export interface ContainerProps {
	children: JSX.Element
}

export default function Container(props: ContainerProps) {
	return (
		<div class="container">
			{props.children}
		</div>
	)
}
