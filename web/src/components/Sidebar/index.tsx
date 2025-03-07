import "./index.scss";

import { AiOutlineHome, AiOutlineHistory, AiOutlineSetting } from "solid-icons/ai";

export default function Sidebar() {
  return (
    <nav id="sidebar">
      <div id="sidebar__brand">
        <h3>JustConv</h3>
      </div>
      <ul id="sidebar__menu">
        <li class="active">
          <i><AiOutlineHome /></i>
          Home
        </li>
		<li>
          <i><AiOutlineHistory /></i>
		  History
        </li>
		<li>
          <i><AiOutlineSetting /></i>
          Settings
        </li>
      </ul>
    </nav>
  );
}
