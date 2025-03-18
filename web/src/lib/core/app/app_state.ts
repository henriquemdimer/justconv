import { Conversion } from "../conversion";
import { State } from "../state/state";

export interface IQueueState {
    queue: Map<string, Conversion>;
}

export class QueueState extends State<IQueueState> {
    private queue: Map<string, Conversion> = new Map();

    public get data() {
        return {
            queue: this.queue
        }
    }

    public append(conv: Conversion) {
        this.queue.set(conv.id, conv);
        return this;
    }
}