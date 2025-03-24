import { ReactNode, useEffect, useState } from "react";
import "./index.scss";
import { Reuleaux } from 'ldrs/react'
import { CommonSizes } from "@/utils/common";

export type ButtonVariants = "default" | "outline" | "flat" | "ghost";
export type ButtonRadius = CommonSizes | "none" | "full";
export type ButtonColors = "default" | "primary" | "danger";
export type ButtonSizes = "default" | "sm";

export interface ButtonProps {
	children?: ReactNode;
	variant?: ButtonVariants;
	radius?: ButtonRadius;
	color?: ButtonColors;
	startContent?: ReactNode;
	endContent?: ReactNode;
	onClick?: () => void;
	className?: string;
	isDisabled?: boolean;
	isLoading?: boolean;
	size?: ButtonSizes;
	isIconOnly?: boolean;
	maxWidth?: string;
}

export default function Button(props: ButtonProps) {
	const [loaderColor, setLoaderColor] = useState("var(--button-text-light)");
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (props.variant === "flat" || props.variant == "outline") {
			if (props.color === "primary") setLoaderColor("var(--button-primary)");
			else if (props.color === "default") setLoaderColor("var(--button-text-dark)");
			else if (props.color === "danger") setLoaderColor("var(--button-danger)");
		}

		if ((props.variant === "outline" && isHovered) || props.variant === "default") {
			if (props.color === "default") setLoaderColor("var(--button-text-dark)");
			else setLoaderColor("var(--button-text-light)");
		}
	}, [isHovered, props.color, props.variant]);

	return (
		<button
			style={{ maxWidth: props.maxWidth }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={props.onClick} type="button"
			className={`button 
				button-variant--${props.variant || "default"}
				button-radius--${props.radius || "sm"}
				button-color--${props.color || "default"}
				button-size--${props.size || "default"}
				${props.isIconOnly ? "button--icon-only" : ""}
				${props.isDisabled || props.isLoading ? "button--disabled" : ""}
				${props.className}
			      `}>
			{!props.isLoading ? (
				props.startContent && <span className="button__start-content">{props.startContent}</span>
				
			) : (
				<i className="button__loader">
					<Reuleaux
						size="15"
						stroke="3"
						stroke-length="0.15"
						bg-opacity="0.5"
						speed="1.2"
						color={loaderColor}
					/>
				</i>
			)}
			{props.children !== undefined && <span className="button__content">{props.children}</span>}
			{props.endContent && <span className="button__end-content">{props.endContent}</span>}
		</button >
	);
}
