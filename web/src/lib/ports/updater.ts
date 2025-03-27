import { Emitter } from "./emitter";

export type UpdaterEvents = {
	open: () => void;
	close: () => void;
	message: (msg: unknown) => void;
}

export interface Updater extends Emitter<UpdaterEvents> {
	init(): void;
	deinit(): void;
	send(message: unknown): void;
}
