import { ReactNode } from "react";
import "./index.scss";

export type TagColors = "default" | "primary" | "danger" | "warn" | "success";

export interface TagProps {
    children: ReactNode;
    color?: TagColors;
}

export default function Tag(props: TagProps) {
    return (
        <div className={`tag 
            tag-color--${props.color || "default"}`}>
            {props.children}
        </div>
    )
}