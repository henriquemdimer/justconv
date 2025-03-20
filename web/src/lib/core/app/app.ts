import { convertBytesAuto } from "@/utils/convert";
import { Conversion, ConversionStatus } from "../conversion";
import { Server } from "../server";
import { StateManager } from "../state/manager";
import { ErrorState, FormatState, QueueState, ServerState } from "./app_state";
import { FormatsGroup } from "../types/formats";
import { Subscriber } from "../observable";
import { UpdateEvent } from "../contracts/updater";
import { Error } from "../error";

export class App {
    private sub?: Subscriber<UpdateEvent>;
    public readonly state = new StateManager<{
        queue: QueueState;
        formats: FormatState;
        servers: ServerState;
        errors: ErrorState;
    }>({
        queue: new QueueState(),
        formats: new FormatState(),
        servers: new ServerState(),
        errors: new ErrorState(),
    })

    public constructor(servers: Server[] = [new Server(this)]) {
        window.addEventListener('unhandledrejection', (e) => new Error(this, e.reason));
        window.addEventListener('error', (e) => new Error(this, e.message));

        let lastActive: Server | undefined;
        this.state.reducers.servers.subscribe(async (st) => {
            if(lastActive) lastActive.updater.deinit();

            if(st.data.active) {
              lastActive = st.data.active;
              this.watchUpdaterEvents(st.data.active);
            }
        });

        this.state.dispatch(this.state.reducers.servers.setList(...servers));
        servers[0].setActive();
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

                    const file = await server.api.downloadConversion(conv);
                    conv.setDownloadedBlob(file);

                    conv.updateStatus(ConversionStatus.DONE);
                    conv.setFinalSize(convertBytesAuto(file.size));
                } else {
                    conv.updateStatus(status);
                }
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
            
            new Conversion(
              this, file.name,
              { from: type },
              { initial: convertBytesAuto(file.size) },
              new Blob([file])
            );
        }
    }

    public async getSupportedFormats() {
        this.state.dispatch(this.state.reducers.formats.set([], true));
        const server = this.getActiveServer();
        if(!server) return;
        
        try {
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
        } catch(err: any) {
          new Error(this, err.message);
        }
    }
    
    public download(id: string) {
        const conv = this.state.reducers.queue.data.queue.get(id);
        if(conv && conv.downloadedBlob) {
            const link = document.createElement("a");

            link.href = URL.createObjectURL(conv.downloadedBlob);
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
            const old_id = conversion.id;

            server.api.createConversion(conversion).then((res) => {
                conversion.updateStatus(ConversionStatus.PENDING);
                conversion.syncId(res.id);

                server.updater.watchUpdates(res.id);
                this.state.dispatch(this.state.reducers.queue.sync(old_id, conversion));
            }).catch(() => {
                conversion.updateStatus(ConversionStatus.FAILED);
            });
        }
    }
}  
