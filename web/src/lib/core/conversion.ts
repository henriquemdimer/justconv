export interface ConversionFormat {
    from: string;
    to?: string;
}

export const ConversionStatus = {
    "WAITING": "Waiting",
    "PENDING": "Pending",
    "RUNNING": "Running",
    "DONE": "Done",
}

export class Conversion {
    public readonly id = crypto.randomUUID();
    public readonly status = ConversionStatus["WAITING"];

    public constructor(public name: string, public format: ConversionFormat, public size: string) {}
}