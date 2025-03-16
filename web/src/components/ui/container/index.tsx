import { ReactNode } from "react";
import "./index.scss";

export interface ContainerProps {
    children: ReactNode;
}

export default function Container(props: ContainerProps) {
    return (
        <div className="container">
            {props.children}
        </div>
    )
}