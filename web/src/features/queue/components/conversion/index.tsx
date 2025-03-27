import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { Dropdown, DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import Tag from "@/components/ui/tag";
import { useConversion } from "@/store/conversion";
import { ConversionFormat, ConversionSize, ConversionStatus } from "@/types/conversion";
import { useState } from "react";
import { BiCollapseVertical } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaDownload, FaRegTrashCan } from "react-icons/fa6";
import FormatsTable from "../formats-table";

export interface ConversionProps {
	id: string;
	name: string;
	size: ConversionSize;
	format: ConversionFormat;
	status: ConversionStatus;
	isChecked?: boolean;
}

export default function Conversion(props: ConversionProps) {
	const [formatSelectionMenuActive, setFormatSelectionMenuActive] = useState(false);
	const [actionsMenuActive, setActionsMenuActive] = useState(false);
	const conversionStore = useConversion();

	function toggleFormatSelectionMenu() {
		if (props.status === ConversionStatus.WAITING || props.status === ConversionStatus.FAILED)
			setFormatSelectionMenuActive(!formatSelectionMenuActive)
	}

	function defineColorTag() {
		if (props.status === ConversionStatus.DOWNLOADING)
			return "primary";
		else if (props.status === ConversionStatus.DONE)
			return "success";
		else if (props.status === ConversionStatus.FAILED)
			return "danger";
		else if (props.status !== ConversionStatus.WAITING)
			return "warn";
	}

	function remove() {
		setActionsMenuActive(false);
		conversionStore.remove(props.id);
	}

	function selectFormat(fmt: string) {
		conversionStore.setFormat(props.id, fmt);
		setFormatSelectionMenuActive(false);
	}

	function onCheck(state: boolean) {
		conversionStore.setChecked(props.id, state);
	}

	return (
		<>
			<td><Checkbox onChange={onCheck} isChecked={props.isChecked} /></td>
			<td className="queue__conversion__name">{props.name}</td>
			<td className="queue__conversion__status"><Tag color={defineColorTag()}>{props.status}</Tag></td>
			<td className="queue__conversion__format">
				<Dropdown
					onClose={() => setFormatSelectionMenuActive(false)}
					active={formatSelectionMenuActive}>
					<Button
						onClick={() => toggleFormatSelectionMenu()}
						variant="outline"
						size="sm"
						endContent={<BiCollapseVertical />}>
						{props.format.to ? (
							<span>{props.format.from.toUpperCase()} -&gt; {props.format.to.toUpperCase()}</span>
						) : (
							<span>Format</span>
						)}
					</Button>
					<DropdownMenu>
						{formatSelectionMenuActive && (<FormatsTable onSelect={selectFormat} />)}
					</DropdownMenu>
				</Dropdown>
			</td>
			<td>
				{props.size.initial}
				{props.size.final != undefined ? (
					<span> -&gt; {props.size.final}</span>
				) : ""}
			</td>
			<td>
				<Dropdown active={actionsMenuActive} onClose={() => setActionsMenuActive(false)}>
					<Button
						onClick={() => setActionsMenuActive(!actionsMenuActive)}
						variant="outline"
						isIconOnly
						size="sm"
						startContent={<BsThreeDotsVertical />}
					/>
					<DropdownMenu side="right">
						<DropdownMenuItem
							onClick={() => { }}
							startContent={<FaDownload />}>
							Download
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => remove()}
							color="danger"
							startContent={<FaRegTrashCan />}>
							Remove
						</DropdownMenuItem>
					</DropdownMenu>
				</Dropdown>
			</td>
		</>
	)
}
