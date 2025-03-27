export type EventMap = {
	[key: string]: (...args: any[]) => void;
}

export interface Listener<T extends EventMap> {
	event: keyof T,
	cb: (...args: any[]) => void;
}

export interface Emitter<T extends EventMap> {
	on<E extends keyof T>(event: E, cb: T[E]): void;
	emit<E extends keyof T>(event: E, ...args: Parameters<T[E]>): boolean;
}
