import { FaAngleRight } from "react-icons/fa6";
import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { Reuleaux } from 'ldrs/react'
import { useServers } from "@/store/servers";
import { FormatsGroup } from "@/types/formats";

export interface FormatsTableProps {
	onSelect?: (format: string) => void;
}

export default function FormatsTable(props: FormatsTableProps) {
	const [isLoading, setIsLoading] = useState(false);
	const serverStore = useServers();
	const lastServer = useRef("");
	const activeServer = serverStore.getActive();
	const [selectedGroup, setSelectedGroup] = useState("");

	useEffect(() => {
		if (activeServer && !selectedGroup && activeServer.formats.length)
				setSelectedGroup(activeServer.formats[0].type);
	}, [activeServer?.formats])

	useEffect(() => {
		(async () => {
			const activeServer = serverStore.getActive();
			if (!activeServer) return;

			if (activeServer.host === lastServer.current || activeServer.formats.length) return;
			lastServer.current = activeServer.host;

			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), 5000);

			try {
				setIsLoading(true);
				const res = await fetch(activeServer.host, { signal: controller.signal });
				clearTimeout(timer);

				if (!res.ok) return;
				const body = await res.json();

				if (body && body.data) {
					const groups: FormatsGroup[] = [];

					for (const [type, fmts] of Object.entries(body.data.formats)) {
						const group: FormatsGroup = {
							type,
							formats: []
						};

						const formats: { [key: string]: string[] } = fmts as any;
						for (const [name, convertible] of Object.entries(formats)) {
							group.formats.push({ name, convertible });
						}

						groups.push(group);
					}

					serverStore.setFormats(activeServer.host, groups);
				}
			} finally {
				setIsLoading(false);
			}
		})();
	}, [activeServer]);


	return (
		<div className="formats-table">
			{isLoading || !activeServer ? (
				<div className="formats-table__loader">
					<i>
						<Reuleaux
							size="37"
							stroke="5"
							stroke-length="0.15"
							bg-opacity="0.5"
							speed="1.2"
							color="var(--primary)"
						/>
					</i>
				</div>
			) : (
				<>
					<div className="formats-table__groups">
						{activeServer.formats.map((group) => (
							<div
								key={group.type}
								onMouseEnter={() => setSelectedGroup(group.type)}
								className={`formats-table__groups__group
									${selectedGroup === group.type ?
										"formats-table__groups__group--active" : ""}
								`}>
								<span>{group.type}</span>
								<FaAngleRight />
							</div>
						))}
					</div>
					<div className="formats-table__formats">
						{activeServer.formats.find((g) =>
							g.type === selectedGroup)?.formats.map((fmt) => (
								<div
									key={fmt.name}
									onClick={() => props.onSelect?.(fmt.name)}
									className="formats-table__formats__format">
									{fmt.name}
								</div>
							))}
					</div>
				</>
			)}
		</div >
	)
}
