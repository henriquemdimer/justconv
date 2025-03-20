export interface IObservable<T> {
    subscribe(cb: (arg: T) => void): Subscriber<T>;
    notify(data: T): void;
}

export class Subscriber<T> {
    public readonly id = crypto.randomUUID();

    public constructor(private readonly observer: Observable<T>, public readonly cb: (arg: T) => void) {}
    public unsubscribe() {
        this.observer.unsubscribe(this.id);
    }
}

export class Observable<T> implements IObservable<T> {
    private subscribers: Map<string, Subscriber<T>> = new Map();

    public unsubscribe(id: string) {
        this.subscribers.delete(id);
    }

    public subscribe(cb: (arg: T) => void): Subscriber<T> {
        const sub = new Subscriber(this, cb);
        this.subscribers.set(sub.id, sub);

        return sub;
    }
    
    public notify(data: T) {
        for(const sub of this.subscribers.values()) {
            sub.cb(data);
        }
    }
}