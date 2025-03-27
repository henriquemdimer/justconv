import { ConversionStatus } from "@/types/conversion";
import { Emitter } from "../ports/emitter";
import { Updater } from "../ports/updater";
import { DefaultEventEmitter } from "../adapters/default_event_emitter";
import { ConversionUpdateData, WebsocketRawMessage } from "@/types/ws/messages";
import { OP_CODES } from "@/types/ws/op_codes";

export type UpdaterServiceEvents = {
	"conversionUpdate": (id: string, status: ConversionStatus) => void;
	"connected": () => void;
}

export interface IUpdaterService extends Emitter<UpdaterServiceEvents> {
	init(): void;
	deinit(): void;
	subscribe(id: string): void;
}

export class UpdaterService extends DefaultEventEmitter<UpdaterServiceEvents> implements IUpdaterService {
	public constructor(private _adapter: Updater) {
		super();

		this._adapter.on("message", (msg) => {
			if (msg instanceof MessageEvent) this.onMessage(msg);
		});

		this._adapter.on("open", () => this.emit("connected"));
		this.onMessage = this.onMessage.bind(this);
	}

	private onMessage(msg: MessageEvent) {
		try {
			let payload: WebsocketRawMessage<unknown>;
			payload = JSON.parse(msg.data);
			if (!payload || payload.op === undefined) return;

			switch (payload.op) {
				case OP_CODES.CONVERSION_UPDATE:
					const data = payload.data as ConversionUpdateData;
					const status = data.status === "DONE" ? ConversionStatus.DONE :
						data.status === "RUNNING" ? ConversionStatus.RUNNING :
							ConversionStatus.PENDING

					this.emit("conversionUpdate", data.id, status);
					break;
			}
		} catch { }
	}

	public init() {
		this._adapter.init();
	}

	public deinit() {
		this._adapter.deinit();
	}

	public subscribe(id: string) {
		this._adapter.send(JSON.stringify({ op: OP_CODES.SUBSCRIBE, data: { id } }));
	}
}
