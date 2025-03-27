export interface ConversionFormat {
	from: string;
	to?: string;
}

export enum ConversionStatus {
	WAITING = "Waiting",
	UPLOADING = "Uploading",
	PENDING = "Pending",
	RUNNING = "Running",
	DOWNLOADING = "Downloading",
	DONE = "Done",
	FAILED = "Failed"
}

export interface ConversionSize {
	initial: string;
	final?: string;
}

export interface IConversion {
	id: string;
	name: string;
	format: ConversionFormat;
	blob?: Blob;
	status: ConversionStatus;
	checked: boolean;
}

export class Conversion implements IConversion {
	public id = crypto.randomUUID().toString();
	public status = ConversionStatus.WAITING;
	public checked = false;

	public constructor(
		public name: string,
		public blob: Blob,
		public size: ConversionSize,
		public format: ConversionFormat) {}
}
