import { ReactNode } from "react";
import "./index.scss"

export interface ContainerProps {
	children: ReactNode;
	className?: string;
}

export default function Container(props: ContainerProps) {
	return (
		<div className={`container ${props.className}`}>
			{props.children}
		</div>
	)
}
