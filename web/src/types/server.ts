import { IUpdaterService, UpdaterService } from "@/lib/services/updater_service";
import { FormatsGroup } from "./formats";
import { Updater } from "@/lib/ports/updater";

export interface IServer {
	host: string;
	formats: FormatsGroup[];
	active: boolean;
	updater: IUpdaterService;
}

export class Server implements IServer {
	public active = false;
	public formats: FormatsGroup[] = [];
	public updater: IUpdaterService;

	public constructor(public host: string, public adapter: Updater) {
		this.updater = new UpdaterService(adapter);
	}
}
