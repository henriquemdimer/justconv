import { App } from "../app/app";
import { UpdateEvent, Updater } from "../contracts/updater";
import { Error } from "../error";
import { Observable } from "../observable";

export interface WebsocketUpdaterOptions {
    host: string;
}

export class WebsocketUpdater extends Observable<UpdateEvent> implements Updater {
    public readonly options: WebsocketUpdaterOptions;
    private ws?: WebSocket;
    private shouldDeinit = false;
    private timerd?: Timer;

    public constructor(private app: App, options: Partial<WebsocketUpdaterOptions>) {
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
        this.ws.onmessage = this.onMessage;
  
        this.ws.onopen = () => {
          clearInterval(this.timerd);

          if(this.ws) this.ws.onclose = () => {
            if(!this.shouldDeinit) {
              new Error(this.app, "Socket closed, trying to reconnect in 10 seconds");
              this.timerd = setInterval(() => {
                this.init();
              }, 10000);
            }
          }
        }

        this.ws.onerror = () => {
            new Error(this.app, "Error occurred in websocket updater.");
            this.ws?.close();
        }
    }

    public deinit() {
      clearInterval(this.timerd);
      this.shouldDeinit = true;
      this.ws?.close();
    }

    private onMessage(msg: MessageEvent) {
        let payload;
        
        try {
            payload = JSON.parse(msg.data);
        } catch(err: any) {
            new Error(this.app, err.message);
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
