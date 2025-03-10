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
import { Conversion, ConversionStatus } from "../../lib/core/types/conversion.ts";

export default function Layout() {
	const queue = useLibState(client.state.reducers.queue);

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
												onClick={async () => client.uploadFiles(await client.ui.askForFiles())}
												style="outline"
												leftIcon={<FaFileCirclePlus />}
												label="Add more files"
											/>
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
														key={item.id}
														label={item.name}
														format_from={item.format?.from || "IDK"}
														format_to={item.format?.to || "IDK"}
														size="10 MB"
														status={{
															label: item.status,
															done: item.status == ConversionStatus.DONE
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
