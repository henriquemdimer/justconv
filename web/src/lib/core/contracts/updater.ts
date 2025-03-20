import { IObservable } from "../observable";

export interface UpdateEvent {
    id: string;
    status: string;
}

export interface Updater extends IObservable<UpdateEvent> {
    init(): void;
    deinit(): void;
    watchUpdates(id: string): void;
}
