import { Api } from "../contracts/api";

export interface HttpApiOptions {
    host: string;
}

export class HttpApi implements Api {
    public readonly options: HttpApiOptions;

    public constructor(options?: Partial<HttpApiOptions>) {
        this.options = this.validateOptions(options);
    }

    private validateOptions(options?: Partial<HttpApiOptions>) {
        const validatedOptions = {
            host: "localhost:8080"
        }

        if(options) {
            if(options.host && typeof options.host === "string") validatedOptions.host = options.host;
        }

        return validatedOptions;
    }

    public getHealth() {}
    public createConversion() {}
}