import "./sidebar.scss";
import { AiOutlineHome, AiOutlineHistory } from "react-icons/ai";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

export default function Sidebar() {
    return (
        <nav id="sidebar">
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
        </nav>
    )
}