import { ApiManager } from "../contracts/api_manager";

export interface HttpApiManagerOptions {
	url: string;
}

export class HttpApiManager implements ApiManager {
	public readonly options: HttpApiManagerOptions;

	public constructor(options: Partial<HttpApiManagerOptions>) {
		this.options = this.validateOptions(options);
	}

	private validateOptions(options: Partial<HttpApiManagerOptions>) {
		const validatedOptions = {
			url: ""
		};

		if(options) {
			if(options.url) validatedOptions.url = options.url;
			else throw new Error("Missing options.url");
		} else throw new Error("Missing options");

		return validatedOptions;
	}

	public async createConversion(name: string, format: string, blob: Blob): Promise<string> {
		const form = new FormData();
		form.append("file", blob, name);

		const res = await fetch(`${this.options.url}/convert?format=${format}`, {
			method: "POST",
			body: form
		});

		const body = await res.json();
	    return body.data.id;
	}
}
