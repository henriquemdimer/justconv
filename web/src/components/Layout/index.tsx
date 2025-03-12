import Button from "../Button/index.tsx";
import Container from "../Container/index.tsx";
import { Panel } from "../Panel/index.tsx";
import Sidebar from "../Sidebar/index.tsx";
import "./index.scss";
import DragNDrop from "../DragNDrop/index.tsx";
import NotImplAlert from "../NotImplAlert/index.tsx";
import { FaLink, FaFileCirclePlus, FaArrowRight } from "react-icons/fa6";
import { useLibState } from "../../lib/core/state/state_manager.tsx";
import { client } from "../../lib/index.ts";
import * as Queue from '../Queue/index.tsx';
import { Conversion } from "../../lib/core/types/conversion.ts";
import * as SelectMenu from '../SelectMenu/index.tsx';
import { useState } from "react";
import FormatsTable from "../FormatsTable/index.tsx";

export default function Layout() {
	const queue = useLibState(client.state.reducers.queue);
	const [formatMenuActive, setActive] = useState(false);
	const [globalFormat, setGlobalFormatState] = useState("");

	function setGlobalFormat(format: string) {
		setGlobalFormatState(format);
		client.setGlobalFormat(format)
		setActive(false);
	}

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
									leftIcon={<FaLink />}
								/>
							</div>
						</Panel>
					</div>
					<Panel dynamic>
						<div className="flex full-height flex-column gap">
							<div className="flex full-height flex-column gap">
								{queue.files.size ? (
									<>
										<div id="convert-actions">
											<Button
												onClick={async () =>
													client.uploadFiles(await client.ui.askForFiles())
												}
												style="outline"
												leftIcon={<FaFileCirclePlus />}
												label="Add more files"
											/>
											<SelectMenu.Container
												active={formatMenuActive}>
												<SelectMenu.Target
													onClick={() => setActive(!formatMenuActive)}
												>
													Convert all to {globalFormat}
												</SelectMenu.Target>
												<SelectMenu.List>
													<FormatsTable onSelect={setGlobalFormat} />
												</SelectMenu.List>
											</SelectMenu.Container>
											<Button
												onClick={() => client.convert()}
												rightIcon={<FaArrowRight />}
												label="Convert"
											/>
										</div>
										<small className="small-text">Conversion queue</small>
										<Queue.Container>
											{Array.from(queue.files.values())
												.map((item: Conversion) => (
													<Queue.Item
														id={item.id}
														key={item.id}
														label={item.name}
														format={{
															from: item.format.from,
															to: item.format?.to
														}}
														size="10 MB"
														status={{
															label: item.status,
															type: item.status.toLowerCase()
														}} />
												))}
										</Queue.Container>
									</>
								) : (
									<DragNDrop />
								)}
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
