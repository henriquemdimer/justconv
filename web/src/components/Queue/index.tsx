import "./index.scss";

export interface QueueHeaderProps {
  title: string;
}

export function Header(props: QueueHeaderProps) {
  return (
    <div class="queue__header">
      <h3>{props.title}</h3>
      <div class="queue__header__metrics">
        <span>200 MB</span>
        <span>(0/10)</span>
      </div>
    </div>
  );
}
