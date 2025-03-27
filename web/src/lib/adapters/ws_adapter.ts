import { Updater, UpdaterEvents } from "../ports/updater";
import { DefaultEventEmitter } from "./default_event_emitter";

export interface WebsocketUpdaterOptions {
	host: string;
}

export class WebsocketAdapter extends DefaultEventEmitter<UpdaterEvents> implements Updater {
	public readonly options: WebsocketUpdaterOptions;
	private ws?: WebSocket;
	private should_deinit = false;
	private reconnect_timer?: Timer;

	public constructor(options: Partial<WebsocketUpdaterOptions>) {
		super();

		this.options = this.validateOptions(options);
	}

	private validateOptions(options: Partial<WebsocketUpdaterOptions>): WebsocketUpdaterOptions {
		if (!options) throw new Error("Missing ws_updater.options");
		if (!options.host) throw new Error("Missing ws_updater.options.host");

		return options as WebsocketUpdaterOptions;
	}

	public init() {
		this.ws = new WebSocket(this.options.host);
		this.ws.onopen = () => {
			this.emit("open");
			clearInterval(this.reconnect_timer);

			this.ws!.onclose = () => {
				this.emit("close");
				this.reconnect();
			}
		}

		this.ws.onmessage = (msg) => this.emit("message", msg);
		this.ws.onerror = () => {
			clearInterval(this.reconnect_timer);
			this.reconnect();
		};
	}

	private reconnect() {
		if (this.should_deinit) return;

		this.reconnect_timer = setInterval(() => {
			if (this.should_deinit) return clearInterval(this.reconnect_timer);
			this.init();
		}, 5000);
	}

	public deinit() {
		this.should_deinit = true;
		this.ws?.close();
		this.ws = undefined;
	}

	public send(msg: string) {
		if (this.ws) this.ws.send(msg);
	}
}
