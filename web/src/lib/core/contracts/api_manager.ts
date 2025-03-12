import { FormatGroup } from "../types/formats";

export interface ApiManager {
	createConversion(name: string, format: string, blob: Blob): Promise<string>;
	getSupportedFormats(): Promise<FormatGroup[]>
}
