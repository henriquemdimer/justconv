import { Emitter } from "./emitter";

export interface Updater extends Emitter {
	init(): void;
	subscribe(id: string): void;
}
