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
            alert(file.name)
        }
    }
}