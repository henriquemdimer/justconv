import Button from "../Button/index.tsx";
import Container from "../Container/index.tsx";
import { Panel } from "../Panel/index.tsx";
import Sidebar from "../Sidebar/index.tsx";
import "./index.scss";
import DragNDrop from "../DragNDrop/index.tsx";
import NotImplAlert from "../NotImplAlert/index.tsx";

export default function Layout() {
	return (
		<Container className="full-height">
			<div id="layout">
				<div className="flex full-width gap">
					<div className="sidebar flex flex-column gap">
						<Panel>
							<Sidebar />
						</Panel>
						<Panel small>
							<div id="self-host" className="flex flex-column">
								<h3>Self host</h3>
								<p>
									Did you know that you can self-host this service on your own
									servers? Check out our GitHub repository.
								</p>
								<Button
									label="Github"
								/>
							</div>
						</Panel>
					</div>
					<Panel dynamic>
						<div className="flex full-height flex-column gap">
							<div className="row flex flex-column gap">
								<small className="small-text">Conversion queue</small>
								<DragNDrop />
							</div>
						</div>
					</Panel>
					<Panel className="sidebar">
						<div className="full-height">
							<NotImplAlert />
						</div>
					</Panel>
				</div>
			</div>
		</Container>
	);
}
