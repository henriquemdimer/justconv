import { ReactNode, useRef } from "react";
import "./index.scss";

export interface CheckboxProps {
    children?: ReactNode;
    onChange?: (active: boolean) => void;
    isIndeterminate?: boolean;
    isChecked?: boolean | null;
}

export default function Checkbox(props: CheckboxProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleOnClick() {
        inputRef.current?.click()
        props.onChange?.(inputRef.current?.checked || false);
    }

    return (
        <div onClick={handleOnClick} className={`checkbox ${props.isIndeterminate ? "checkbox--indeterminate" : ""}`}>
            <input onChange={() => {}} checked={props.isChecked === null ? props.isIndeterminate : props.isChecked} ref={inputRef} type="checkbox" />
            <span className="checkbox__checkmark"></span>
            {props.children}
        </div>
    )
}
