export interface ApiManager {
	createConversion(name: string, format: string, blob: Blob): Promise<string>;
}
