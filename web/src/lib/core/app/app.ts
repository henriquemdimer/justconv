import { convertBytesAuto } from "@/utils/convert";
import { Conversion } from "../conversion";
import { Server } from "../server";
import { StateManager } from "../state/manager";
import { QueueState } from "./app_state";

export class App {
    public readonly state = new StateManager<{
        queue: QueueState;
    }>({
        queue: new QueueState()
    })

    public constructor(public readonly servers: Server[] = [new Server()]) {}

    public uploadFiles(files: FileList) {
        for (const file of files) {
            const typeSplit = file.type.split('/');
            const type = typeSplit[typeSplit.length - 1];
            const conv = new Conversion(file.name, { from: type }, convertBytesAuto(file.size));
            this.state.dispatch(this.state.reducers.queue.append(conv));
        }
    }
}  