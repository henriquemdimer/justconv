import { ReactNode } from "react";
import "./index.scss";

export interface SelectMenuProps {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
}

export interface SelectMenuContainerProps extends SelectMenuProps {
	active?: boolean;
	small?: boolean;
}

export function Container(props: SelectMenuContainerProps) {
	return (
		<div onClick={props.onClick}
			className={`select-menu ${props.small ? "select-menu--small" : ""} ${props.active ? "select-menu--active" : ""}`}>
			{props.children}
		</div>
	)
}

export function Target(props: SelectMenuProps) {
	return (
		<div 
			onClick={() => !props.disabled && props.onClick?.()}
			className="select-menu__target">
			{props.children}
		</div>
	)
}

export function List(props: SelectMenuProps) {
	return (
		<div
			className="select-menu__list">
			{props.children}
		</div>
	)
}

export function Options() { }
