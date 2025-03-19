import { convertBytesAuto } from "@/utils/convert";
import { Conversion, ConversionStatus } from "../conversion";
import { Server } from "../server";
import { StateManager } from "../state/manager";
import { FormatState, QueueState } from "./app_state";
import { FormatsGroup } from "../types/formats";

export class App {
    public readonly state = new StateManager<{
        queue: QueueState;
        formats: FormatState
    }>({
        queue: new QueueState(),
        formats: new FormatState()
    })

    public constructor(public readonly servers: Server[] = [new Server()]) {
        this.getSupportedFormats();

        this.servers[0].updater.subscribe(ev => {
            const conv = this.state.reducers.queue.data.queue.get(ev.id);
            if(conv) {
                const status = ev.status === "DONE" ? ConversionStatus.DONE : 
                ev.status === "PENDING" ? ConversionStatus.PENDING : 
                ConversionStatus.RUNNING;
                conv.updateStatus(status);
                this.state.dispatch(this.state.reducers.queue.set(conv));
            }
        })
    }

    public uploadFiles(files: FileList) {
        for (const file of files) {
            const typeSplit = file.type.split('/');
            const type = typeSplit[typeSplit.length - 1];
            const conv = new Conversion(file.name, { from: type }, convertBytesAuto(file.size), new Blob([file]));
            this.state.dispatch(this.state.reducers.queue.set(conv));
        }
    }

    public async getSupportedFormats() {
        if(this.state.reducers.formats.data.loading) return;

        this.state.dispatch(this.state.reducers.formats.set([], true));
        const server = this.servers[0];
        const res = await server.api.getHealth();

        if(res && res.formats) {
            const groups: FormatsGroup[] = [];

            for (const [type, formats] of Object.entries(res.formats)) {
                const group: FormatsGroup = {
                    type,
                    formats: []
                }

                for (const [name, convertible] of Object.entries(formats)) {
                    group.formats.push({ name, convertible });
                }

                groups.push(group);
            }

            this.state.dispatch(this.state.reducers.formats.set(groups));
        }
    }

    public convert() {
        const server = this.servers[0];

        for (const conversion of this.state.reducers.queue.data.queue.values()) {
            if(conversion.status !== ConversionStatus.WAITING || !conversion.format.to) continue;

            conversion.updateStatus(ConversionStatus.UPLOADING);
            this.state.dispatch(this.state.reducers.queue.set(conversion));
            const old_id = conversion.id;

            server.api.createConversion(conversion).then((res) => {
                conversion.updateStatus(ConversionStatus.PENDING);
                conversion.syncId(res.id);
                server.updater.watchUpdates(res.id);
                this.state.dispatch(this.state.reducers.queue.sync(old_id, conversion));
            });
        }
    }
}  