import { Updater } from "../contracts/updater";
import { DefaultEventEmitter } from "../default_event_emitter";

export interface WebsocketUpdaterOptions {
	url: string;
}

export class WebsocketUpdater extends DefaultEventEmitter implements Updater {
	public readonly options: WebsocketUpdaterOptions;
	private ws?: WebSocket;

	public constructor(options: Partial<WebsocketUpdaterOptions>) {
		super();

		this.options = this.validateOptions(options);
		this.onMessage = this.onMessage.bind(this);
	}

	private validateOptions(options: Partial<WebsocketUpdaterOptions>) {
		const validatedOptions = {
			url: ""
		};

		if(options) {
			if(options.url) validatedOptions.url = options.url;
			else throw new Error("Missing options.url");
		} else throw new Error("Missing options");

		return validatedOptions;
	}

	public init() {
		this.ws = new WebSocket(this.options.url);

		this.ws.onmessage = this.onMessage;
	}

	public subscribe(id: string) {
		if(this.ws) {
			this.ws.send(JSON.stringify({ op: 1, data: { id } }));
		}
	}

	private onMessage(msg: MessageEvent) {
		let payload;

		try {
			payload = JSON.parse(msg.data);
		} catch(_) {}

		switch(payload.op) {
			case 0:
				this.emit('conversionUpdate', { id: payload.data.id, status: payload.data.status });
		}
	}
}
