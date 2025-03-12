import { useEffect, useState } from "react";
import "./index.scss";
import { client } from "../../lib";
import { FormatGroup } from "../../lib/core/types/formats";
import { FaAngleRight } from "react-icons/fa6";

export interface FormatsTableProps {
	onSelect?: (format: string) => void;
}

export default function FormatsTable(props: FormatsTableProps) {
	const [formats, setFormats] = useState<FormatGroup[]>([]);
	const [selectedGroup, setSelectedGroup] = useState("");

	useEffect(() => {
		(async () => {
			const fmts = await client.api.getSupportedFormats()
			setFormats(fmts);
			setSelectedGroup(fmts[0]?.type)
		})();
	}, []);

	return (
		<div className="formats-table">
			<div className="formats-table__groups">
				{formats.map((item) => (
					<div
						className={`
						${selectedGroup == item.type ? "formats-table__groups__group--active" : ""}
						formats-table__groups__group`}
						onMouseOver={() => setSelectedGroup(item.type)}>
						<span>{item.type}</span>
						<i><FaAngleRight /></i>
					</div>
				))}
			</div>
			<div className="formats-table__formats">
				{formats.find((g) => g.type === selectedGroup)?.formats.map((item) => (
					<div onClick={() => props.onSelect?.(item.input)}>{item.input}</div>
				))}
			</div>
		</div>
	)
}
