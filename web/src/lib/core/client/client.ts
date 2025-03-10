import { HttpApiManager } from "../api/http_api_manager";
import { StateManager } from "../state/state_manager";
import { ConversionStatus } from "../types/conversion";
import { UIManager } from "../ui_manager";
import { WebsocketUpdater } from "../updater/websocket_updater";
import { QueueState } from "./client_state";

export class Client {
	public readonly ui = new UIManager();
	public readonly state = new StateManager<{
		queue: QueueState;
	}>({
		queue: new QueueState()
	})

	public constructor(
		public readonly api = new HttpApiManager({ url: 'http://localhost:8080' }),
		public readonly updater = new WebsocketUpdater({ url: 'ws://localhost:8080/ws' })
	) {
		this.updater.init();

		this.updater.on('conversionUpdate', (conv) => {
			const status = conv.status == "DONE" ? ConversionStatus.DONE : ConversionStatus.PENDING;
			this.state.dispatch(this.state.reducers.queue.updateStatus(conv.id, status));
		})
	}

	public init() {
		this.ui.init();
	}

	public uploadFiles(files: FileList) {
		for (const file of files) {
			const conv = {
				id: crypto.randomUUID(),
				name: file.name,
				status: ConversionStatus.PENDING,
				format: {
					to: 'png',
					from: 'jpg'
				},
				blob: new Blob([file], { type: file.type })
			}

			this.state.dispatch(this.state.reducers.queue.append(conv));
		}
	}

	public convert() {
		for (const file of this.state.reducers.queue.data.files.values()) {
			if (!file.format?.to) continue;

			this.api.createConversion(file.name, file.format?.to, file.blob).then((id) => {
				this.updater.subscribe(id);
				this.state.dispatch(this.state.reducers.queue.syncId(file.id, id));
			});
		}
	}
}
