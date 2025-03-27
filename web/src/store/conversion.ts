import { Conversion, ConversionStatus } from "@/types/conversion";
import { create } from "zustand";

export interface ConversionState {
	list: Map<string, Conversion>;
	set(conv: Conversion): void;
	remove(id: string): void;
	setFormat(id: string, fmt: string): void;
	setChecked(id: string, toggle: boolean): void;
	setStatus(id: string, status: ConversionStatus): void;
	syncId(old_id: string, new_id: string): void;
}

export const useConversion = create<ConversionState>((set) => ({
	list: new Map(),
	set: (conv: Conversion) => set((state) => {
		const list = new Map(state.list);
		list.set(conv.id, conv);

		return { list: list }
	}),
	remove: (id: string) => set((state) => {
		const list = new Map(state.list);
		list.delete(id);

		return { list: list }
	}),
	setFormat: (id: string, fmt: string) => set((state) => {
		const list = new Map(state.list);
		const conv = list.get(id);

		if(conv) {
			conv.format.to = fmt;
			list.set(id, conv);
		}

		return { list };
	}),
	setChecked: (id: string, toggle: boolean) => set((state) => {
		const list = new Map(state.list);
		const conv = list.get(id);

		if(conv) {
			conv.checked = toggle;
			list.set(id, conv);
		}

		return { list };
	}),
	setStatus: (id: string, status: ConversionStatus) => set((state) => {
		const list = new Map(state.list);
		const conv = list.get(id);

		if(conv) {
			conv.status = status;
			list.set(conv.id, conv);
		}

		return { list };
	}),
	syncId: (old_id: string, new_id: string) => set((state) => {
		const list = new Map(state.list);
		const conv = list.get(old_id);

		if(conv) {
			list.delete(old_id);
			conv.id = new_id;
			list.set(new_id, conv);
		}

		return { list };
	})
}))
