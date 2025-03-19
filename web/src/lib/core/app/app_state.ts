import { Conversion } from "../conversion";
import { State } from "../state/state";
import { FormatsGroup } from "../types/formats";

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

    public set(conv: Conversion) {
        this.queue.set(conv.id, conv);
        return this;
    }

    public sync(old_id: string, conv: Conversion) {
        this.queue.delete(old_id);
        this.queue.set(conv.id, conv);
        return this;
    }
}

export interface IFormatState {
    formats: FormatsGroup[];
    loading: boolean;
}

export class FormatState extends State<IFormatState> {
    private formats: FormatsGroup[] = [];
    private loading: boolean = false;

    public get data() {
        return {
            formats: this.formats,
            loading: this.loading,
        }
    }

    public set(formats: FormatsGroup[], loading = false) {
        this.formats = formats;
        this.loading = loading;
        return this;
    }
}