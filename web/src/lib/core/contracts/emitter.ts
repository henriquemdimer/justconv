export type ListenerFn<T extends any[]> = (...args: T) => void;

export interface Emitter {
	on<T extends any[]>(ev: string, fn: ListenerFn<T>): void;
	emit(ev: string, ...data: any[]): void;
}
