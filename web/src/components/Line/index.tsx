import "./index.scss"

export interface LineProps {
	text: string
}

export default function Line(props: LineProps) {
	return (
		<div id="line">
			<span>{props.text}</span>
		</div>
	)
}
