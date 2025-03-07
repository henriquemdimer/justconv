import Button from "../Button/index.tsx";
import "./index.scss";
import { JSX } from "solid-js";
import { BiRegularDownload } from "solid-icons/bi";

export interface QueueProps {
  children: JSX.Element;
}

export function Container(props: QueueProps) {
  return (
    <div class="queue">
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
    <div class="queue__item">
      <div class="queue__item__infos">
        <span>{props.label}</span>
        <div class="queue__item__infos__status">
          <div class="queue__item__infos__status__dot" />
          <span>{props.status}</span>
        </div>
        <span>{props.format}</span>
        <span>{props.size}</span>
      </div>
      <Button leftIcon={<BiRegularDownload />} />
    </div>
  );
}
