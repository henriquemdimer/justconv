import { convertBytesAuto } from "@/utils/convert";
import { Conversion, ConversionStatus } from "../conversion";
import { Error } from "../error";
import { Server } from "../server";
import { StateManager } from "../state/manager";
import { ErrorState, FormatState, QueueState, ServerState, UiState } from "./app_state";

export class App {
	public readonly state = new StateManager<{
		queue: QueueState;
		formats: FormatState;
		servers: ServerState;
		errors: ErrorState;
		ui: UiState
	}>({
		queue: new QueueState(),
		formats: new FormatState(),
		servers: new ServerState(),
		errors: new ErrorState(),
		ui: new UiState(),
	})

	public constructor(servers: Server[] = [new Server(this)]) {
		window.addEventListener('unhandledrejection', (e) => new Error(this, e.reason));
		window.addEventListener('error', (e) => new Error(this, e.message));

		let lastActive: Server | undefined;
		this.state.reducers.servers.subscribe(async (st) => {
			if (st.data.active) {
				if (lastActive && lastActive.options.host !== st.data.active.options.host)
					lastActive.deinit();

				lastActive = st.data.active;
			}
		});

		this.state.dispatch(this.state.reducers.servers.setList(...servers));
		servers[0].setActive();
	}

	public getActiveServer() {
		return this.state.reducers.servers.data.active;
	}

	public uploadFiles(files: FileList) {
		for (const file of files) {
			const typeSplit = file.type.split('/');
			const type = typeSplit[typeSplit.length - 1];

			new Conversion(
				this, file.name,
				{ from: type },
				{ initial: convertBytesAuto(file.size) },
				new Blob([file])
			);
		}
	}

	public download(id: string) {
		const conv = this.state.reducers.queue.data.queue.get(id);
		if (conv && conv.downloadedBlob) {
			const link = document.createElement("a");

			link.href = URL.createObjectURL(conv.downloadedBlob);
			link.download = conv.name.split('.')[0] + `.${conv.format.to}`;

			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		}
	}

	public convert() {
		const server = this.getActiveServer();
		if (!server) return;

		for (const conversion of this.state.reducers.queue.data.queue.values()) {
			if ((conversion.status !== ConversionStatus.WAITING && conversion.status !== ConversionStatus.FAILED) || !conversion.format.to) continue;

			conversion.updateStatus(ConversionStatus.UPLOADING);
			const old_id = conversion.id;

			server.api.createConversion(conversion).then((res) => {
				conversion.updateStatus(ConversionStatus.PENDING);
				conversion.syncId(res.id);

				server.updater.watchUpdates(res.id);
				this.state.dispatch(this.state.reducers.queue.sync(old_id, conversion));
			}).catch(() => {
				conversion.updateStatus(ConversionStatus.FAILED);
			});
		}
	}
}  
