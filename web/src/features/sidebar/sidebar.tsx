import { Dropdown, DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import "./sidebar.scss";
import { AiOutlineHome, AiOutlineHistory } from "react-icons/ai";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import Button from "@/components/ui/button";
import { BiCollapseVertical } from "react-icons/bi";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { app } from "@/lib";
import { useLibState } from "@/lib/core/state/manager";
import { IServerState } from "@/lib/core/app/app_state";
import { ServerStatus } from "./components/server_status/server_status";

export default function Sidebar() {
	const [menuActive, setMenuActive] = useState(false);
	const servers = useLibState<IServerState>(app.state.reducers.servers);

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
						{servers.active?.options.host}
					</Button>
					<DropdownMenu>
						{servers.list.values().map((server) => (
							<DropdownMenuItem
								onClick={() => { server.setActive(); setMenuActive(false) }}
								maxWidth="200px"
								startContent={<ServerStatus host={server.options.host} />}>
								{server.options.host}
							</DropdownMenuItem>
						))}
						<DropdownMenuItem color="primary" startContent={<FaPlus />}>Add</DropdownMenuItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</nav>
	)
}
