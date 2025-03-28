import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox/index.tsx";
import { Dropdown, DropdownMenu } from "@/components/ui/dropdown";
import { useConversion } from "@/store/conversion";
import { ConversionStatus, Conversion as LibConversion } from "@/types/conversion.ts";
import { RefObject, useState } from "react";
import { BiCollapseVertical } from "react-icons/bi";
import { FaDownload, FaRegTrashCan } from "react-icons/fa6";
import Conversion from "./components/conversion/index.tsx";
import FormatsTable from "./components/formats-table";
import "./queue.scss";
import { AiOutlineCloudUpload } from "react-icons/ai";

export interface QueueProps {
	filesInput: RefObject<HTMLInputElement | null>;
}

export default function Queue(props: QueueProps) {
	const [formatSelectionMenuActive, setFormatSelectionMenuActive] = useState(false);
	const conversionStore = useConversion();
	const checked = [...conversionStore.list.values()].filter((c) => c.checked);

	function iterate(fn: (conv: LibConversion) => void) {
		for (const conv of conversionStore.list.values()) {
			fn(conv);
		}
	}

	function onFormatSelect(fmt: string) {
		iterate((conv) => {
			if (conv.checked)
				conversionStore.setFormat(conv.id, fmt);
		});

		setFormatSelectionMenuActive(false);
	}

	function removeAll() {
		iterate((conv) => {
			if (conv.checked)
				conversionStore.remove(conv.id);
		});
	}

	function downloadAll() {
		alert("NOT IMPLEMENTED");
	}

	function checkAll() {
		let check = false;
		if (checked.length > 0 && checked.length < conversionStore.list.size || !checked.length)
			check = true;

		iterate((conv) => {
			conversionStore.setChecked(conv.id, check);
		});
	}

	return (
		<div id="queue">
			<div id="queue__mass-actions" className={`${checked.length ? "queue__mass-actions--active" : ""}`}>
				<Button
					onClick={() => removeAll()}
					color="danger"
					startContent={<FaRegTrashCan />}>
					Delete all
				</Button>
				<Button
					onClick={() => downloadAll()} color="primary" startContent={<FaDownload />}>
					Download all
				</Button>
				<Dropdown
					onClose={() => setFormatSelectionMenuActive(false)} active={formatSelectionMenuActive}>
					<Button
						color="primary"
						variant="flat"
						onClick={() => setFormatSelectionMenuActive(!formatSelectionMenuActive)}
						endContent={<BiCollapseVertical />}>
						Select format for all
					</Button>
					<DropdownMenu side="top">
						{formatSelectionMenuActive && (<FormatsTable
							onSelect={(fmt) => onFormatSelect(fmt)} />)}
					</DropdownMenu>
				</Dropdown>
			</div>
			<div id="queue__header">
				<span>Conversion queue</span>
				<span>{[...conversionStore.list.values()]
					.filter((c) =>
						c.status === ConversionStatus.DONE)
					.length} / {conversionStore.list.size}</span>
			</div>
			<div id="queue__table">
				<table>
					<thead>
						<tr>
							<th>{<Checkbox
								onChange={checkAll}
								isChecked={checked.length > 0 &&
									checked.length === conversionStore.list.size ?
									true : null}
								isIndeterminate={checked.length > 0 &&
									checked.length !== conversionStore.list.size} />
							}</th>
							<th>Name</th>
							<th>Status</th>
							<th>Format</th>
							<th>Size</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
					{[...conversionStore.list.values()].map((conv) => (
						<tr key={conv.id}>
							<Conversion
								isChecked={conv.checked}
								id={conv.id}
								name={conv.name}
								size={conv.size}
								status={conv.status}
								format={conv.format} />
						</tr>
					))}
					</tbody>
				</table>
				{conversionStore.list.size < 1 && (
					<div onClick={() => props.filesInput.current?.click()} id="queue__drag-n-drop">
						<i><AiOutlineCloudUpload /></i>
						Drop files or click here
					</div>
				)}
			</div>
		</div >
	)
}
