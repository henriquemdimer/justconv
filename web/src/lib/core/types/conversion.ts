export enum ConversionStatus {
	UPLOADING = "Uploading",
	DOWNLOADING = "Downloading",
	PENDING = "Pending",
	RUNNING = "Running",
	DONE = "Done",
}

export interface ConversionFormat {
	from: string;
	to: string;
}

export interface Conversion {
	id: string;
	name: string;
	blob: Blob;
	format?: ConversionFormat;
	status: ConversionStatus;
}
