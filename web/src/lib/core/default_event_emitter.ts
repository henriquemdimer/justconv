import { Emitter, ListenerFn } from "./contracts/emitter";

export interface Listener {
	ev: string;
	fn: ListenerFn<any[]>;
}

export class DefaultEventEmitter implements Emitter {
	public constructor(private readonly listeners: Listener[] = []) {}

	public on<T extends any[]>(ev: string, fn: ListenerFn<T>) {
		this.listeners.push({ ev, fn });
	}

	public emit(ev: string, ...data: any[]) {
		for (const listener of this.listeners.filter((l) => l.ev === ev)) {
			listener.fn(...data);
		}
	}
}
