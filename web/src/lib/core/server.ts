import { HttpApi } from "./api/http_api";
import { Api } from "./contracts/api";
import { Updater } from "./contracts/updater";
import { WebsocketUpdater } from "./updater/ws_updater";

export interface ServerOptions {
    host: string;
    updaterHost: string;
}

export class Server {
    public readonly options: ServerOptions;
    public readonly api: Api;
    public readonly updater: Updater;

    public constructor(options?: Partial<ServerOptions>) {
        this.options = this.validateOptions(options);
        this.api = new HttpApi({
            host: this.options.host
        });
        this.updater = new WebsocketUpdater({
            host: this.options.updaterHost
        });

        this.updater.init();
    }

    private validateOptions(options?: Partial<ServerOptions>) {
        const validatedOptions = {
            host: "http://localhost:8080",
            updaterHost: "ws://localhost:8080/ws"
        }

        if(options) {
            if(options.host && typeof options.host === "string") validatedOptions.host = options.host;
            if(options.updaterHost && typeof options.updaterHost === "string") validatedOptions.updaterHost = options.updaterHost;
        }

        return validatedOptions;
    }
}