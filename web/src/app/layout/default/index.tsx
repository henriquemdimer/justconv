import "./index.scss";

import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import Sidebar from "@/features/sidebar/sidebar";
import { useConversion } from "@/store/conversion";
import { useServers } from "@/store/servers";
import { Server } from "@/types/server";
import { Reuleaux } from "ldrs/react";
import { ReactNode, useEffect, useRef, useState } from "react"
import { FaGithub } from "react-icons/fa6";

export interface DefaultLayoutProps {
	children: ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
	const useServerStore = useServers();
	const conversionStore = useConversion();
	const server = useServerStore.getActive();
	const serverRef = useRef<Server>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!server) return;
		if (serverRef.current?.host === server.host) return;

		setLoading(true);
		serverRef.current?.updater.deinit();
		serverRef.current = server;

		server.updater.on("conversionUpdate", (id, status) => {
			conversionStore.setStatus(id, status);
		});

		server.updater.on("connected", () => setLoading(false));
		server.updater.init();
	}, [server]);

	return (
		<>
			<div id="preloader" className={`${loading ? "preloader--active" : ""}`}>
				<i>
					<Reuleaux
						size="60"
						stroke="7"
						stroke-length="0.15"
						bg-opacity="0.5"
						speed="1.2"
						color="white"
					/>
				</i>
				<span>Connecting to {server?.host}</span>
			</div>
			<Container>
				<div id="layout">
					<div className="layout__side-column">
						<div className="layout__panel">
							<Sidebar />
						</div>
						<div id="layout__self-host" className="layout__panel layout__panel--small layout__panel--with-padding">
							<h3>Self host</h3>
							<p>Did you know you can self-host this service on your own servers? It's easy—check out our GitHub repository!</p>
							<Button startContent={<FaGithub />} color="primary">Github</Button>
						</div>
					</div>
					<div className="layout__middle-column">
						<div className="layout__panel layout__panel--with-padding layout__panel--transparent">
							{props.children}
						</div>
					</div>
					<div className="layout__side-column">
						<div className="layout__panel">A</div>
					</div>
				</div>
			</Container>
		</>
	)
}
