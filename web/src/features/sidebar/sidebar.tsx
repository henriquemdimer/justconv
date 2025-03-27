import { Dropdown, DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import "./sidebar.scss";
import { AiOutlineHome, AiOutlineHistory } from "react-icons/ai";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import Button from "@/components/ui/button";
import { BiCollapseVertical } from "react-icons/bi";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useServers } from "@/store/servers";
import { ServerStatus } from "./components/server_status/server_status";
import { Server } from "@/types/server";
import { WebsocketAdapter } from "@/lib/adapters/ws_adapter";

export default function Sidebar() {
	const [menuActive, setMenuActive] = useState(false);
	const serverStore = useServers();

	return (
		<nav id="sidebar">
			<div>
				<div id="sidebar__brand">
					<h3>JustConv</h3>
				</div>
				<ul id="sidebar__menu">
					<li>
						<i><AiOutlineHome /></i>
						Home
					</li>
					<li>
						<i><AiOutlineHistory /></i>
						History
					</li>
					<li>
						<i><HiOutlineCog8Tooth /></i>
						Settings
					</li>
				</ul>
			</div>
			<div id="sidebar__server-selection">
				<Dropdown active={menuActive} onClose={() => setMenuActive(false)}>
					<Button maxWidth="200px" onClick={() => setMenuActive(!menuActive)}
						endContent={<BiCollapseVertical />}
						color="default"
						variant="flat">
						{serverStore.getActive() ? serverStore.getActive()?.host : (
							<span>Add a server</span>
						)}
					</Button>
					<DropdownMenu maxHeight="200px">
						{menuActive && [...serverStore.servers.values()].map((s) => (
							<DropdownMenuItem
								key={s.host}
								startContent={<ServerStatus host={s.host} />}
								onClick={() => serverStore.setActive(s)}>
								{s.host}
							</DropdownMenuItem>
						))}
						<DropdownMenuItem
							onClick={() => serverStore.set(
								new Server("http://localhost:8080",
									new WebsocketAdapter({ host: "ws://localhost:8080/ws" })
								)
							)}
							color="primary"
							startContent={<FaPlus />}>
							Add
						</DropdownMenuItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</nav>
	)
}
