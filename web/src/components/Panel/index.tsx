import { ReactNode } from "react";
import "./index.scss";

export interface PanelProps {
	children?: ReactNode;
	small?: boolean;
	dynamic?: boolean;
	className?: string;
}

export function Panel(props: PanelProps) {
	return (
		<div
			className={`panel ${props.small ? "panel--small" : ""} ${props.dynamic ? "panel--dynamic" : ""
				} ${props.className}`}
		>
			{props.children}
		</div>
	);
}
