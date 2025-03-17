import { ReactNode, useRef } from "react";
import "./index.scss";

export interface InputProps {
    placeholder?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
}

export default function Input(props: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div onClick={() => inputRef.current?.focus()} className="input">
            {props.startContent}
            <input ref={inputRef} placeholder={props.placeholder} />
            {props.endContent}
        </div>
    )
}