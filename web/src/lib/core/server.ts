import { HttpApi } from "./api/http_api";
import { Api } from "./contracts/api";

export interface ServerOptions {
    host: string;
}

export class Server {
    public readonly options: ServerOptions;
    public readonly api: Api;

    public constructor(options?: Partial<ServerOptions>) {
        this.options = this.validateOptions(options);
        this.api = new HttpApi({
            host: this.options.host
        });
    }

    private validateOptions(options?: Partial<ServerOptions>) {
        const validatedOptions = {
            host: "localhost:8080"
        }

        if(options) {
            if(options.host && typeof options.host === "string") validatedOptions.host = options.host;
        }

        return validatedOptions;
    }
}