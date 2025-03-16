import { ReactNode, useState } from "react";
import "./index.scss";

export interface InputProps {
    placeholder?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
}

export default function Input(props: InputProps) {
    const [id] = useState(crypto.randomUUID());

    function irradiateClick() {
        const input = document.getElementById(id);
        if (input) {
            input.focus();
        }
    }

    return (
        <div onClick={irradiateClick} className="input">
            {props.startContent}
            <input id={id} placeholder={props.placeholder} />
            {props.endContent}
        </div>
    )
}