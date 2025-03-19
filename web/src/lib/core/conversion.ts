export interface ConversionFormat {
    from: string;
    to?: string;
}

export enum ConversionStatus {
    WAITING = "Waiting",
    UPLOADING = "Uploading",
    PENDING = "Pending",
    RUNNING = "Running",
    DONE = "Done"
}

export class Conversion {
    public id = crypto.randomUUID().toString();
    public status = ConversionStatus.WAITING;

    public constructor(public name: string, public format: ConversionFormat, public size: string, public blob: Blob) {}
    
    public setFormat(format: string) {
        this.format.to = format;
    }

    public updateStatus(status: ConversionStatus) {
        this.status = status;
    }

    public syncId(server_id: string) {
        this.id = server_id;
    }
}