import { Observable } from "../observable";

export abstract class State<T> extends Observable<State<T>> {
    abstract get data(): T;
}