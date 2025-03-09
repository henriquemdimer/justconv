import "./index.scss";

export default function Sidebar() {
  return (
    <nav id="sidebar">
      <div id="sidebar__brand">
        <h3>JustConv</h3>
      </div>
      <ul id="sidebar__menu">
        <li className="active">
          Home
        </li>
		<li>
		  History
        </li>
		<li>
          Settings
        </li>
      </ul>
    </nav>
  );
}
