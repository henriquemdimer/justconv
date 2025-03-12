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
			const status = conv.status == "DONE" ? ConversionStatus.DONE : conv.status === "RUNNING" ? ConversionStatus.RUNNING : ConversionStatus.PENDING;
			this.state.dispatch(this.state.reducers.queue.updateStatus(conv.id, status));

			const files = Array.from(this.state.reducers.queue.data.files.values())
			document.title = `JustConv (${files.filter(
					(f) => f.status === ConversionStatus.DONE).length
			} / ${files.length})`;
		})
	}

	public async init() {
		this.ui.init();
		console.log(await this.api.getSupportedFormats());
	}

	public uploadFiles(files: FileList) {
		for (const file of files) {
			const conv = {
				id: crypto.randomUUID(),
				name: file.name,
				status: ConversionStatus.WAITING,
				format: {
					from: file.type.split('/')[1]
				},
				blob: new Blob([file], { type: file.type })
			}
	
			console.log(file.type);
			this.state.dispatch(this.state.reducers.queue.append(conv));
		}
	}

	public setFormat(conv_id: string, format: string) {
		this.state.dispatch(this.state.reducers.queue.setFormat(conv_id, format));
	}

	public setGlobalFormat(format: string) {
		for (const conv of this.state.reducers.queue.data.files.values()) {
			this.setFormat(conv.id, format);
		}
	}

	public convert() {
		for (const file of this.state.reducers.queue.data.files.values().filter((c) => c.format.to)) {
			if (!file.format?.to || file.status !== ConversionStatus.WAITING) continue;

			this.api.createConversion(file.name, file.format.to, file.blob).then((id) => {
				this.state.dispatch(this.state.reducers.queue.syncId(file.id, id));
				this.updater.subscribe(id);
			});
		}
	}
}
