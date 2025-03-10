import { DefaultEventEmitter } from "../default_event_emitter";

export abstract class State<T> extends DefaultEventEmitter {
	public abstract get data(): T;
}
