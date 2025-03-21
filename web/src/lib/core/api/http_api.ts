import { Api } from "../contracts/api";
import { Conversion } from "../conversion";

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
            host: "http://localhost:8080"
        }

        if(options) {
            if(options.host && typeof options.host === "string") validatedOptions.host = options.host;
        }

        return validatedOptions;
    }

    public async getHealth() {
        const res = await fetch(`${this.options.host}`);
        const body = await res.json();

        return {
            status: body.message,
            formats: body.data.formats,
        }
    }

    public async createConversion(conv: Conversion) {
        const form = new FormData();
        form.append("file", conv.blob, conv.name);

        const res = await fetch(`${this.options.host}/convert?format=${conv.format.to}`, {
            method: "POST",
            body: form
        });
        if(!res.ok) throw new Error("Request Failed")

        const body = await res.json();

        return {
            message: body.message,
            id: body.data.id
        }
    }

    public async downloadConversion(conv: Conversion) {
        const res = await fetch(`${this.options.host}/convert/${conv.id}/download`);
        if (!res.ok) throw new Error("Request Failed");
        const blob = await res.blob();
        return blob;
    }
}
