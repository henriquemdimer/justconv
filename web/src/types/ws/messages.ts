export interface WebsocketRawMessage<T> {
	op: number,
	data: T;
}

export interface ConversionUpdateData {
	id: string;
	status: "PENDING" | "RUNNING" | "DONE";
}

export type ConversionUpdateMessage = WebsocketRawMessage<ConversionUpdateData>;
