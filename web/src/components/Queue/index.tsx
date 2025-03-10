import { ReactNode } from "react";
import Button from "../Button/index.tsx";
import "./index.scss";
import { AiOutlineCloudDownload } from "react-icons/ai";

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
  format_from: string;
  format_to: string
  size: string;
  status: string;
}

export function Item(props: QueueItemProps) {
  return (
    <div className="queue__item">
      <div className="queue__item__infos">
        <span className="queue__item__infos__name">{props.label}</span>
        <div className="queue__item__infos__status">
          <div className="queue__item__infos__status__dot" />
          <span>{props.status}</span>
        </div>
        <span>{props.format_from} -&gt; {props.format_to}</span>
        <span className="queue__item__infos__size">{props.size}</span>
      </div>
      <Button leftIcon={<AiOutlineCloudDownload />} />
    </div>
  );
}
