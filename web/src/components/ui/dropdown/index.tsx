import { ReactNode } from "react";
import "./index.scss";

export interface DropdownBaseProps {
    children: ReactNode;
}

export interface DropdownContainerProps extends DropdownBaseProps {
    active?: boolean;
}

export function Dropdown(props: DropdownContainerProps) {
    return (
        <div className={`dropdown ${props.active ? "dropdown--active" : ""}`}>
            {props.children}
        </div>
    )
}

export function DropdownMenu(props: DropdownBaseProps) {
    return (
        <div className="dropdown__menu">
            {props.children}
        </div>
    )
}