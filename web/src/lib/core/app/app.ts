import { convertBytesAuto } from "@/utils/convert";
import { Conversion, ConversionStatus } from "../conversion";
import { Server } from "../server";
import { StateManager } from "../state/manager";
import { FormatState, QueueState, ServerState } from "./app_state";
import { FormatsGroup } from "../types/formats";
import { Subscriber } from "../observable";
import { UpdateEvent } from "../contracts/updater";

export class App {
    private sub?: Subscriber<UpdateEvent>;
    public readonly state = new StateManager<{
        queue: QueueState;
        formats: FormatState;
        servers: ServerState;
    }>({
        queue: new QueueState(),
        formats: new FormatState(),
        servers: new ServerState(),
    })

    public constructor(servers: Server[] = [new Server()]) {
        this.state.reducers.servers.subscribe((st) => {
            if(st.data.active) this.watchUpdaterEvents(st.data.active);
            this.getSupportedFormats();
        });

        this.state.dispatch(this.state.reducers.servers.setList(...servers));
    }

    public watchUpdaterEvents(server: Server) {
        if(this.sub) this.sub.unsubscribe();
        this.sub = server.updater.subscribe(async ev => {
            const conv = this.state.reducers.queue.data.queue.get(ev.id);
            if(conv) {
                const status = ev.status === "DONE" ? ConversionStatus.DONE : 
                ev.status === "PENDING" ? ConversionStatus.PENDING : 
                ConversionStatus.RUNNING;
                
                if(status == ConversionStatus.DONE) {
                    conv.updateStatus(ConversionStatus.DOWNLOADING);
                    this.state.dispatch(this.state.reducers.queue.set(conv));

                    const file = await server.api.downloadConversion(conv);
                    conv.donwloadedBlob = file;

                    conv.updateStatus(ConversionStatus.DONE);
                    conv.setFinalSize(convertBytesAuto(file.size));
                } else {
                    conv.updateStatus(status);
                }

                this.state.dispatch(this.state.reducers.queue.set(conv));
            }
        })
    }

    public getActiveServer() {
        return this.state.reducers.servers.data.active;
    }

    public uploadFiles(files: FileList) {
        for (const file of files) {
            const typeSplit = file.type.split('/');
            const type = typeSplit[typeSplit.length - 1];
            const conv = new Conversion(file.name, { from: type }, { initial: convertBytesAuto(file.size) }, new Blob([file]));
            this.state.dispatch(this.state.reducers.queue.set(conv));
        }
    }

    public async getSupportedFormats() {
        if(this.state.reducers.formats.data.loading) return;

        this.state.dispatch(this.state.reducers.formats.set([], true));
        const server = this.getActiveServer();
        if(!server) return;

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
    
    public download(id: string) {
        const conv = this.state.reducers.queue.data.queue.get(id);
        if(conv && conv.donwloadedBlob) {
            const link = document.createElement("a");

            link.href = URL.createObjectURL(conv.donwloadedBlob);
            link.download = conv.name.split('.')[0] + `.${conv.format.to}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    }

    public convert() {
        const server = this.getActiveServer();
        if(!server) return;

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