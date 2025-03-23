import "./index.scss";

import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Toast } from "@/components/ui/toast";
import Sidebar from "@/features/sidebar/sidebar";
import { app } from "@/lib";
import { IErroState, IUiState } from "@/lib/core/app/app_state";
import { useLibState } from "@/lib/core/state/manager";
import { ReactNode } from "react"
import { FaGithub } from "react-icons/fa6";

export interface DefaultLayoutProps {
	children: ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
	const errors = useLibState<IErroState>(app.state.reducers.errors)
	const ui = useLibState<IUiState>(app.state.reducers.ui);

	function onToastClose(id: string) {
		app.state.dispatch(app.state.reducers.ui.remove(id));
	}

	return (
		<Container>
			<>
				{ui.toasts.values().map((t, i) => (
					ui.toasts.size - i < 3 && (
						<Toast
							color={t.color}
							variant={t.variant}
							key={t.id}
							onClose={() => onToastClose(t.id)}
							title={t.title}
							description={t.description}
							covered={i !== ui.toasts.size - 1} />
					)
				))}
			</>
			<div id="error-magnifier" className={`${errors.list.length > 0 ? "error-magnifier--active" : ""}`}>Errors: {errors.list.length}</div>
			<div id="layout">
				<div className="layout__side-column">
					<div className="layout__panel">
						<Sidebar />
					</div>
					<div id="layout__self-host" className="layout__panel layout__panel--small layout__panel--with-padding">
						<h3>Self host</h3>
						<p>Did you know you can self-host this service on your own servers? It's easy—check out our GitHub repository!</p>
						<Button startContent={<FaGithub />} color="primary">Github</Button>
					</div>
				</div>
				<div className="layout__middle-column">
					<div className="layout__panel layout__panel--with-padding layout__panel--transparent">
						{props.children}
					</div>
				</div>
				<div className="layout__side-column">
					<div className="layout__panel">A</div>
				</div>
			</div>
		</Container>
	)
}
