import { UpdateEvent, Updater } from "../contracts/updater";
import { Observable } from "../observable";

export interface WebsocketUpdaterOptions {
    host: string;
}

export class WebsocketUpdater extends Observable<UpdateEvent>  implements Updater {
    public readonly options: WebsocketUpdaterOptions;
    private ws?: WebSocket;

    public constructor(options: Partial<WebsocketUpdaterOptions>) {
        super();
        this.options = this.validateOptions(options);
        this.onMessage = this.onMessage.bind(this);
    }

    private validateOptions(options?: Partial<WebsocketUpdaterOptions>) {
        const validatedOptions = {
            host: "ws://localhost:8080/ws"
        }

        if(options) {
            if(options.host && typeof options.host === "string") validatedOptions.host = options.host;
        }

        return validatedOptions;
    }

    public init() {
        this.ws = new WebSocket(this.options.host);
        this.ws.onopen = () => console.log("ws open");
        this.ws.onmessage = this.onMessage;
    }

    private onMessage(msg: MessageEvent) {
        let payload;
        
        try {
            payload = JSON.parse(msg.data);
        } catch(err) {
            return;
        }

        if(!payload) return;

        switch(payload.op) {
            case 0:
                this.notify({ id: payload.data.id, status: payload.data.status });
        }
    }

    public watchUpdates(id: string) {
        this.send({ op: 1, data: { id } });
    }

    private send(data: unknown) {
        if(this.ws) this.ws.send(JSON.stringify(data));
    }
}