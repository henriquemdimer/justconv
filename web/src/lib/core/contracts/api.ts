import { Conversion } from "../conversion";

export interface Api {
    getHealth(): Promise<HealthResponse>;
    createConversion(conv: Conversion): Promise<CreateConversionResponse>;
    downloadConversion(conv: Conversion): Promise<Blob>;
}

export interface HealthResponse {
    status: string;
    formats: {
        [key: string]: { [key: string]: string[] }
    }
}

export interface CreateConversionResponse {
    message: string;
    id: string;
}