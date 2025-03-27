import { Emitter, EventMap, Listener } from "../ports/emitter";

export class DefaultEventEmitter<T extends EventMap> implements Emitter<T> {
	private listeners: Map<keyof T, Listener<T>[]> = new Map();

	public on<E extends keyof T>(event: E, cb: T[E]) {
		const match = this.listeners.get(event) || [];
		match.push({ event, cb });

		this.listeners.set(event, match);
	}

	public emit<E extends keyof T>(event: E, ...args: Parameters<T[E]>) {
		const listeners = this.listeners.get(event) || [];
		if(listeners.length) {
			for (const listener of listeners) {
				listener.cb(...args);
			}

			return true;	
		} else return false;
	}
}
