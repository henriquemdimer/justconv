import { Server } from '@/types/server';
import { create } from 'zustand';
import { FormatsGroup } from "@/types/formats.ts";

export interface ServersState {
	servers: Map<string, Server>;
	set(server: Omit<Server, "active">): void;
	setActive(server: Server): void;
	setFormats(host: string, formats: FormatsGroup[]): void;
	getActive(): Server | undefined;
}

export const useServers = create<ServersState>((set, get) => ({
	servers: new Map(),
	getActive: () => {
		return [...get().servers.values()].find((s) => s.active);
	},
	set: (server: Server) => set(state => {
		if(get().servers.has(server.host)) return { servers: get().servers };

		server.formats = server.formats || [];
		if(!state.getActive()) server.active = true;

		const servers = new Map(state.servers);
		servers.set(server.host, server);

		return { servers };
	}),
	setActive: (server: Server) => set(() => {
		const servers = new Map();
		for (const sv of [...get().servers.values()].filter((s) => s.active)) {
			sv.active = false;
			servers.set(sv.host, sv);
		}

		server.active = true;
		servers.set(server.host, server);

		return { servers }
	}),
	setFormats: (host: string, formats: FormatsGroup[]) => set((state) => {
		const servers = new Map(state.servers);
		const server = servers.get(host);

		if(server) {
			server.formats = formats;
			servers.set(host, server);
		}

		return { servers };
	})
}))
