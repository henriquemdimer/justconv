import { ReactNode, useState } from "react";
import Button from "../Button/index.tsx";
import "./index.scss";
import { AiOutlineCloudDownload } from "react-icons/ai";
import * as SelectMenu from '../SelectMenu/index.tsx';
import FormatsTable from '../FormatsTable/index.tsx';
import { client } from "../../lib/index.ts";

export interface QueueProps {
	children: ReactNode;
}

export function Container(props: QueueProps) {
	return (
		<div className="queue">
			{props.children}
		</div>
	);
}

export interface QueueItemProps {
	id: string;
	label: string;
	format: {
		from: string;
		to?: string;
	}
	size: string;
	status: {
		label: string;
		type: string;
	};
}

export function Item(props: QueueItemProps) {
	const [active, setActive] = useState(false);

	function setFormat(format: string) {
		client.setFormat(props.id, format);
		setActive(false);
	}

	return (
		<div className="queue__item">
			<div className="queue__item__infos">
				<span className="queue__item__infos__name">{props.label}</span>
				<div className="queue__item__infos__status">
					<div
						className={`
			  queue__item__infos__status__dot 
			  queue__item__infos__status__dot--${props.status.type}
			`} />
					<span>{props.status.label}</span>
				</div>
				<SelectMenu.Container small active={active}>
					<SelectMenu.Target disabled={props.status.type !== "waiting"}
						onClick={() => setActive(!active)}>
						{props.format.to ? (
							<span className="queue__item__infos__format">
								{props.format.from} -&gt; {props.format.to}
							</span>
						) : (
							<span>Format</span>
						)}
					</SelectMenu.Target>
					<SelectMenu.List>
						<FormatsTable onSelect={setFormat} />
					</SelectMenu.List>
				</SelectMenu.Container>
				<span className="queue__item__infos__size">{props.size}</span>
			</div>
			<Button leftIcon={<AiOutlineCloudDownload />} />
		</div>
	);
}
