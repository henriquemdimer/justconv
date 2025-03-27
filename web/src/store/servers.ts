import { Server } from '@/types/server';
import { create } from 'zustand';

export interface ServersState {
	servers: Map<string, Server>;
	set(server: Omit<Server, "active">): void;
	setActive(server: Server): void;
	getActive(): Server | undefined;
}

export const useServers = create<ServersState>((set, get) => ({
	servers: new Map(),
	getActive: () => {
		return [...get().servers.values()].find((s) => s.active);
	},
	set: (server: Server) => set(state => {
		server.formats = server.formats || [];
		if(!state.getActive()) server.active = true;

		const servers = new Map(state.servers);
		servers.set(server.host, server);

		return { servers };
	}),
	setActive: (server: Server) => set((state) => {
		const servers = new Map();
		for (const sv of [...state.servers.values()].filter((s) => s.active)) {
			sv.active = false;
			servers.set(sv.host, sv);
		}

		server.active = true;
		servers.set(server.host, server);

		return { servers }
	})
}))
