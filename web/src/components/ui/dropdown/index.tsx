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

export interface DropdownMenuProps extends DropdownBaseProps {
    side?: "top" | "bottom" | "left" | "right";
}

export function DropdownMenu(props: DropdownMenuProps) {
    return (
        <div className={`dropdown__menu
            dropdown__menu--${props.side || "bottom"}
         `}>
            {props.children}
        </div>
    )
}

export interface DropdownMenuItemProps extends DropdownBaseProps {
    color?: "default" | "danger" | "primary"
    startContent?: ReactNode;
    onClick?: () => void;
    maxWidth?: string;
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
    return (
        <div style={{maxWidth: props.maxWidth}} onClick={props.onClick} className={`dropdown__menu__item
            dropdown__menu__item-color--${props.color || "default"}
        `}>
            {props.startContent}
            {props.children}
        </div>
    )
}
