import { App } from "./app/app";

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
    FAILED = "Failed",
    DONE = "Done"
}

export class Conversion {
    public id = crypto.randomUUID().toString();
    public status = ConversionStatus.WAITING;
    public downloadedBlob?: Blob;

    public constructor(
      private app: App,
      public name: string,
      public format: ConversionFormat,
      public size: ConversionSize,
      public blob: Blob
    ) {
      this.dispatch();
    }

    private dispatch() {
      this.app.state.dispatch(this.app.state.reducers.queue.set(this));
    }

    public setFormat(format: string) {
        this.format.to = format;
        this.dispatch();
    }

    public setDownloadedBlob(blob: Blob) {
      this.downloadedBlob = blob;
      this.dispatch();
    }

    public updateStatus(status: ConversionStatus) {
        this.status = status;
        this.dispatch();
    }

    public syncId(server_id: string) {
        this.id = server_id;
    }

    public setFinalSize(size: string) {
        this.size.final = size;
        this.dispatch();
    }
}
