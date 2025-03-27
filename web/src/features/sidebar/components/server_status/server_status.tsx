import { Reuleaux } from "ldrs/react";
import "./server_status.scss"
import { useEffect, useState } from "react";

export interface ServerStatusProps {
	host: string;
}

export function ServerStatus(props: ServerStatusProps) {
	const [isHealthy, setIsHealthy] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), 5000);
			try {
				const res = await fetch(props.host, { signal: controller.signal });
				clearTimeout(timer);
				if (!res.ok) setIsHealthy(false);

				const body = await res.json();
				if (body && body.message) setIsHealthy(true);
				else setIsHealthy(false)
			} catch {
				setIsHealthy(false)
			} finally {
				setIsLoading(false)
			}
		})();
	}, [props.host]);

	return (
		<>
			{isLoading ? (
				<i className="button__loader">
					<Reuleaux
						size="15"
						stroke="3"
						stroke-length="0.15"
						bg-opacity="0.5"
						speed="1.2"
						color="var(--primary)"
					/>
				</i>
			) : (
				<div className={`server-status server-status--${isHealthy ? "ok" : "bad"}`} />
			)}
		</>
	)
}
