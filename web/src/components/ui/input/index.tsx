import { ReactNode } from "react";
import "./index.scss";

export interface InputProps {
    placeholder?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
}

export default function Input(props: InputProps) {
    return (
        <div className="input">
            {props.startContent}
            <input placeholder={props.placeholder} />
            {props.endContent}
        </div>
    )
}