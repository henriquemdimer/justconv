import "./index.scss";

import { GoHome, GoHistory } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

export default function Sidebar() {
	return (
		<nav id="sidebar">
			<div id="sidebar__brand">
				<h3>JustConv</h3>
			</div>
			<ul id="sidebar__menu">
				<li className="active">
					<i><GoHome /></i>
					Home
				</li>
				<li>
					<i><GoHistory /></i>
					History
				</li>
				<li>
					<i><IoSettingsOutline /></i>
					Settings
				</li>
			</ul>
		</nav>
	);
}
