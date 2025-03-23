import { ReactNode, useEffect, useState } from "react";
import "./index.scss";
import { IoInformationCircleSharp } from "react-icons/io5";
import Reuleaux from "ldrs/react/Reuleaux";
import { CommonColors, CommonVariants } from "@/utils/common";
import { FaTimes } from "react-icons/fa";

export interface ToastProps {
	title: string;
	description?: string;
	isLoading?: boolean;
	color?: CommonColors;
	variant?: Omit<CommonVariants, "outline">;
	covered?: boolean;
	onClose?: () => void;
}

export function Toast(props: ToastProps) {
	const [active, setActive] = useState(false);
	const [loaderColor, setLoaderColor] = useState("black");

	useEffect(() => {
		const timer = setTimeout(() => {
			setActive(true);
		}, 200);

		return () => {
			clearTimeout(timer);
		}
	}, []);

	useEffect(() => {
		if(props.variant === "solid") {
			if(props.color === "danger" || props.color === "primary")
				setLoaderColor("white");
			else if(props.color === "default")
				setLoaderColor("black");
		} else if(props.variant === "flat" || props.variant === "outline") {
			if(props.color === "danger") setLoaderColor("var(--danger)");
			else if(props.color === "primary") setLoaderColor("var(--primary)");
			else if(props.color === "default") setLoaderColor("black");
		}
	}, [props.color])

	return (
		<div className={`toast
			${props.covered ? "toast--covered" : ""}
			${active ? "toast--active" : ""}
			toast-color--${props.color || "default"}
			toast-variant--${props.variant || "flat"}
		`}>
			{props.isLoading ? (
				<i className="toast__loader">
					<Reuleaux
						size="20"
						stroke="3"
						stroke-length="0.15"
						bg-opacity="0.5"
						speed="1.2"
						color={loaderColor}
					/>
				</i>
			) : (
				<i><IoInformationCircleSharp /></i>
			)}
			<div>
				<span className="toast__title">{props.title}</span>
				{props.description !== null && <span className="toast__description">{props.description}</span>}
			</div>
			<i onClick={() => props.onClose?.()} className="toast__close">
				<FaTimes />
			</i>
		</div>
	)
}

export interface ToastContainerProps {
	children: ReactNode;
}
