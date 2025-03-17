import { ReactNode, useEffect, useRef } from "react";
import "./index.scss";

export interface DropdownBaseProps {
    children: ReactNode;
}

export interface DropdownContainerProps extends DropdownBaseProps {
    active?: boolean;
    onClose?: () => void;
}

export function Dropdown(props: DropdownContainerProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(ev: MouseEvent) {
            if (dropdownRef.current && props.active && !dropdownRef.current.contains(ev.target as Node)) {
                props.onClose?.();
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [props]);

    return (
        <div ref={dropdownRef} className={`dropdown ${props.active ? "dropdown--active" : ""}`}>
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