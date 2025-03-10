import { useEffect, useState } from "react";
import { State } from "./state";

export function useLibState<T>(selector: State<T>) {
	const [state, setState] = useState(selector.data);
	
	useEffect(() => {
		selector.on('update', (st: any) => {
			setState(st.data);
		})
	}, []);

	return state;
}

export class StateManager<T> {
	public constructor(public readonly reducers: T) {}

	public dispatch(state: State<any>) {
		state.emit('update', state);
	}
}
