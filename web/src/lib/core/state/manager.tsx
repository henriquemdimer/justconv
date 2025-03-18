import { useEffect, useState } from "react";
import { State } from "./state";

export function useLibState<T>(reducer: State<T>) {
    const [state, setState] = useState(reducer.data);

    useEffect(() => {
        const sub = reducer.subscribe((st) => {
            setState(st.data);
        });

        return () => {
            sub.unsubscribe();
        }
    }, [reducer]);

    return state;
}

export class StateManager<T> {
    public constructor(public readonly reducers: T) { }

    public dispatch(state: State<any>) {
        state.notify(state);
    }
}