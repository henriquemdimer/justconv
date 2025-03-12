import { ApiManager } from "../contracts/api_manager";
import { Format, FormatGroup } from "../types/formats";

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

	public async getSupportedFormats(): Promise<FormatGroup[]> {
	    const res = await fetch(`${this.options.url}`);
		const body = await res.json();

		const groups = [];
		for (const [group_key, group_value] of Object.entries(body.data.formats)) {
			const group: FormatGroup = {
				type: group_key,
				formats: []
			}

			for (const [main_format, subformats] of Object.entries(group_value as any)) {
				const format: Format = {
					input: main_format,
					convertible: subformats as string[],
				}

				group.formats.push(format);
			}

			groups.push(group);
		}

		return groups;
	}
}
