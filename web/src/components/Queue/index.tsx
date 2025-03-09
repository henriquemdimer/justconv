import { ReactNode } from "react";
import Button from "../Button/index.tsx";
import "./index.scss";

export interface QueueProps {
  children: ReactNode;
}

export function Container(props: QueueProps) {
  return (
    <div className="queue">
      {props.children}
    </div>
  );
}

export interface QueueItemProps {
  label: string;
  format: string;
  size: string;
  status: string;
}

export function Item(props: QueueItemProps) {
  return (
    <div className="queue__item">
      <div className="queue__item__infos">
        <span>{props.label}</span>
        <div className="queue__item__infos__status">
          <div className="queue__item__infos__status__dot" />
          <span>{props.status}</span>
        </div>
        <span>{props.format}</span>
        <span>{props.size}</span>
      </div>
      <Button />
    </div>
  );
}
