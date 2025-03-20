export interface ConversionFormat {
    from: string;
    to?: string;
}

export interface ConversionSize {
    initial: string;
    final?: string;
}

export enum ConversionStatus {
    WAITING = "Waiting",
    UPLOADING = "Uploading",
    PENDING = "Pending",
    RUNNING = "Running",
    DOWNLOADING = "Downloading",
    DONE = "Done"
}

export class Conversion {
    public id = crypto.randomUUID().toString();
    public status = ConversionStatus.WAITING;
    public donwloadedBlob?: Blob;

    public constructor(public name: string, public format: ConversionFormat, public size: ConversionSize, public blob: Blob) {}
    
    public setFormat(format: string) {
        this.format.to = format;
    }

    public updateStatus(status: ConversionStatus) {
        this.status = status;
    }

    public syncId(server_id: string) {
        this.id = server_id;
    }

    public setFinalSize(size: string) {
        this.size.final = size;
    }
}