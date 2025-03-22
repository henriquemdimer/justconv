import { convertBytesAuto } from "@/utils/convert";
import { HttpApi } from "./api/http_api";
import { App } from "./app/app";
import { Api } from "./contracts/api";
import { UpdateEvent, Updater } from "./contracts/updater";
import { ConversionStatus } from "./conversion";
import { Error } from "./error";
import { Subscriber } from "./observable";
import { WebsocketUpdater } from "./updater/ws_updater";
import { FormatsGroup } from "./types/formats";

export interface ServerOptions {
	host: string;
	updaterHost: string;
}

export class Server {
	public readonly options: ServerOptions;
	public readonly api: Api;
	public readonly updater: Updater;
	private sub?: Subscriber<UpdateEvent>;

	public constructor(private app: App, options?: Partial<ServerOptions>) {
		this.options = this.validateOptions(options);
		this.api = new HttpApi({
			host: this.options.host
		});
		this.updater = new WebsocketUpdater(app, {
			host: this.options.updaterHost
		});
	}

	public async setActive() {
		try {
			await this.api.getHealth();
			this.app.state.dispatch(this.app.state.reducers.servers.setActive(this));
			this.getSupportedFormats();

			this.updater.init();
			this.watchUpdates();
		} catch (err) {
			new Error(this.app, "Server is not healthy, trying to reconnect in 10 seconds");

			setTimeout(() => {
				this.setActive();
			}, 10000);
		}
	}

	public deinit() {
		this.sub?.unsubscribe();
		this.updater.deinit()
	}

	public async getSupportedFormats() {
		this.app.state.dispatch(this.app.state.reducers.formats.set([], true));

		try {
			const res = await this.api.getHealth();
			if (res && res.formats) {
				const groups: FormatsGroup[] = [];

				for (const [type, formats] of Object.entries(res.formats)) {
					const group: FormatsGroup = {
						type,
						formats: []
					}

					for (const [name, convertible] of Object.entries(formats)) {
						group.formats.push({ name, convertible });
					}

					groups.push(group);
				}

				this.app.state.dispatch(this.app.state.reducers.formats.set(groups));
			} else {
				new Error(this.app, "Failed to get supported formats.");
			}
		} catch (err: any) {
			new Error(this.app, err.message);
		}
	}

	private watchUpdates() {
		if (this.sub) this.sub.unsubscribe();

		this.sub = this.updater.subscribe(async ev => {
			const conv = this.app.state.reducers.queue.data.queue.get(ev.id);

			if (conv) {
				const status = ev.status === "DONE" ? ConversionStatus.DONE :
					ev.status === "PENDING" ? ConversionStatus.PENDING :
						ConversionStatus.RUNNING;

				if (status == ConversionStatus.DONE) {
					conv.updateStatus(ConversionStatus.DOWNLOADING);

					try {
						const file = await this.api.downloadConversion(conv);
						conv.setDownloadedBlob(file);

						conv.updateStatus(ConversionStatus.DONE);
						conv.setFinalSize(convertBytesAuto(file.size));
					} catch (err: any) {
						conv.updateStatus(ConversionStatus.FAILED);
					}
				} else {
					conv.updateStatus(status);
				}
			}
		})
	}

	private validateOptions(options?: Partial<ServerOptions>) {
		const validatedOptions = {
			host: "http://localhost:8080",
			updaterHost: "ws://localhost:8080/ws"
		}

		if (options) {
			if (options.host && typeof options.host === "string") validatedOptions.host = options.host;
			if (options.updaterHost && typeof options.updaterHost === "string") validatedOptions.updaterHost = options.updaterHost;
		}

		return validatedOptions;
	}
}
