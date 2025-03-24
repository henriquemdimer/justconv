import { app } from "@/lib";
import { IServerState } from "@/lib/core/app/app_state";
import { useLibState } from "@/lib/core/state/manager";
import { ServerStatus as LibServerStatus } from "@/lib/core/server";
import "./server_status.scss"
import { useState, useEffect } from "react";

export interface ServerStatusProps {
	host: string;
}

export function ServerStatus(props: ServerStatusProps) {
	const [ok, setOk] = useState(false);
	const servers = useLibState<IServerState>(app.state.reducers.servers);
	const match = servers.list.get(props.host);

	useEffect(() => {
		(async () => {
			if(match) {
				if(match.status === LibServerStatus.UNKNOWN) {
					try {
						await match.checkHealth();
						setOk(true);
					} catch {
						setOk(false);
					}
				} else if(match.status === LibServerStatus.NOT_HEALTHY) setOk(false);
				else setOk(true);
			}
		})();
	}, [props.host]);

	return (
		<div className={`server-status server-status--${ok ? "ok": "bad"}`} />
	)
}
